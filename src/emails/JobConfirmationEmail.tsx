import { Html, Body, Head, Heading, Container, Text, Link, Preview, Section } from "@react-email/components";
import * as React from "react";

interface JobConfirmationProps {
  studioName: string;
  jobTitle: string;
  jobId: string;
}

export const JobConfirmationEmail = ({ studioName, jobTitle, jobId }: JobConfirmationProps) => {
  return (
    <Html>
      <Head />
      <Preview>Tu búsqueda laboral está activa - ETA</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={header}>
            <Heading style={h1}>ETA</Heading>
          </Section>
          <Text style={text}>Hola {studioName},</Text>
          <Text style={text}>
            Confirmamos el pago y la publicación de tu búsqueda para <strong>{jobTitle}</strong>. Ya está visible para toda nuestra comunidad de artistas.
          </Text>
          <Text style={text}>
            Podés editar cualquier detalle de esta publicación durante los próximos 30 días directamente desde tu Dashboard:
          </Text>
          <Link href={`https://empleotattoo.vercel.app/dashboard/editar-empleo/${jobId}`} style={button}>
            EDITAR AVISO
          </Link>
          <Text style={footer}>
            Empleo Tattoo Argentina<br/>
            Red Curada de Profesionales del Tatuaje
          </Text>
        </Container>
      </Body>
    </Html>
  );
};

const main = {
  backgroundColor: "#ffffff",
  fontFamily: "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
};

const container = {
  margin: "0 auto",
  padding: "40px 20px",
  maxWidth: "600px",
  border: "1px solid #e5e7eb",
};

const header = {
  borderBottom: "1px solid #000",
  paddingBottom: "20px",
  marginBottom: "30px",
};

const h1 = {
  color: "#000",
  fontSize: "24px",
  fontWeight: "bold" as const,
  margin: "0",
  letterSpacing: "-0.5px",
};

const text = {
  color: "#000",
  fontSize: "16px",
  lineHeight: "24px",
  marginBottom: "24px",
};

const button = {
  backgroundColor: "#000",
  color: "#fff",
  padding: "16px 32px",
  textDecoration: "none",
  display: "inline-block",
  fontWeight: "500",
  fontSize: "14px",
  letterSpacing: "0.5px",
  marginTop: "10px",
  marginBottom: "30px",
};

const footer = {
  color: "#6b7280",
  fontSize: "12px",
  lineHeight: "20px",
  borderTop: "1px solid #e5e7eb",
  paddingTop: "20px",
};

export default JobConfirmationEmail;
