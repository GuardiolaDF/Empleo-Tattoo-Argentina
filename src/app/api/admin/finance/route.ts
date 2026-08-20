import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import connectToDatabase from '@/lib/mongodb';
import Job from '@/models/Job';

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    await connectToDatabase();
    
    // Fetch all active jobs to calculate revenue
    const activeJobs = await Job.find({ status: 'active' }).sort({ createdAt: -1 }).lean();

    let totalRevenue = 0;
    let monthlyRevenue = 0;
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    const transactions = activeJobs.map((job: any) => {
      let amountPaid = job.pricePaid || 0;
      
      // Retroactive calculation for jobs before pricePaid was added
      if (!job.pricePaid && job.pricePaid !== 0) {
        const isCoupon = job.couponCode || (job.paymentId && job.paymentId.toString().includes('CUPON'));
        if (!isCoupon) {
          amountPaid = 5000;
        } else {
          amountPaid = 0; // Assuming 100% discount coupons for MVP
        }
      }

      totalRevenue += amountPaid;

      const jobDate = new Date(job.updatedAt || job.createdAt);
      if (jobDate.getMonth() === currentMonth && jobDate.getFullYear() === currentYear) {
        monthlyRevenue += amountPaid;
      }

      return {
        id: job._id.toString(),
        title: job.title,
        studioName: job.studioName,
        date: jobDate.toISOString(),
        amount: amountPaid,
        couponCode: job.couponCode || null,
        paymentId: job.paymentId || null
      };
    });

    return NextResponse.json({
      totalRevenue,
      monthlyRevenue,
      transactions
    }, { status: 200 });

  } catch (error) {
    console.error('Finance API Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
