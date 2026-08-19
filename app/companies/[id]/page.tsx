import { CompanyDetails } from "@/components/companies/CompanyDetails";

export default async function CompanyDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <CompanyDetails id={id} />;
}
