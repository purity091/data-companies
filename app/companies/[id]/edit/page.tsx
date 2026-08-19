import { CompanyEdit } from "@/components/companies/CompanyEdit";

export default async function EditCompanyPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <CompanyEdit id={id} />;
}
