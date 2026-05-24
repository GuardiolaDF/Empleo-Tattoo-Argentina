import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import connectToDatabase from '@/lib/mongodb';
import AnalyticsEvent from '@/models/AnalyticsEvent';

// POST: Register an event (no auth required — visitors trigger this)
export async function POST(request: NextRequest) {
  try {
    await connectToDatabase();
    const body = await request.json();

    const { eventType, jobId, studioUserId } = body;

    if (!eventType || !studioUserId) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    }

    await AnalyticsEvent.create({ eventType, jobId, studioUserId });

    return NextResponse.json({ ok: true }, { status: 201 });
  } catch (error) {
    console.error('Analytics POST Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// GET: Retrieve aggregated stats for the logged-in user
export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
    }

    await connectToDatabase();
    const userId = session.user.id;

    // Get date boundaries
    const now = new Date();
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const fourteenDaysAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);

    // Total counts (all time)
    const totals = await AnalyticsEvent.aggregate([
      { $match: { studioUserId: userId } },
      { $group: { _id: '$eventType', count: { $sum: 1 } } },
    ]);

    // Last 7 days counts
    const thisWeek = await AnalyticsEvent.aggregate([
      { $match: { studioUserId: userId, createdAt: { $gte: sevenDaysAgo } } },
      { $group: { _id: '$eventType', count: { $sum: 1 } } },
    ]);

    // Previous 7 days counts (for % change)
    const lastWeek = await AnalyticsEvent.aggregate([
      {
        $match: {
          studioUserId: userId,
          createdAt: { $gte: fourteenDaysAgo, $lt: sevenDaysAgo },
        },
      },
      { $group: { _id: '$eventType', count: { $sum: 1 } } },
    ]);

    // Daily breakdown for last 7 days
    const daily = await AnalyticsEvent.aggregate([
      { $match: { studioUserId: userId, createdAt: { $gte: sevenDaysAgo } } },
      {
        $group: {
          _id: {
            date: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { '_id.date': 1 } },
    ]);

    // Per-job breakdown
    const perJob = await AnalyticsEvent.aggregate([
      {
        $match: {
          studioUserId: userId,
          eventType: 'job_view',
          jobId: { $exists: true, $ne: null },
        },
      },
      { $group: { _id: '$jobId', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 },
    ]);

    return NextResponse.json(
      {
        totals: Object.fromEntries(totals.map((t: { _id: string; count: number }) => [t._id, t.count])),
        thisWeek: Object.fromEntries(thisWeek.map((t: { _id: string; count: number }) => [t._id, t.count])),
        lastWeek: Object.fromEntries(lastWeek.map((t: { _id: string; count: number }) => [t._id, t.count])),
        daily: daily.map((d: { _id: { date: string }; count: number }) => ({
          date: d._id.date,
          count: d.count,
        })),
        perJob,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Analytics GET Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
