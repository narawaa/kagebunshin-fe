import DetailStudioPageModule from '@/modules/DetailStudioPageModule';

type Props = {
  params: any
}

export default async function Page({ params }: Props) {
  const resolved = await params;
  const pk = resolved?.pk ?? '';
  return <DetailStudioPageModule pk={pk} />;
}