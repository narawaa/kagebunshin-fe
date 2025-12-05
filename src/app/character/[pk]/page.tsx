import DetailCharacterPageModule from '@/modules/DetailCharacterPageModule';

type Props = {
  params: any
}

export default async function Page({ params }: Props) {
  const resolved = await params;
  const pk = resolved?.pk ?? '';
  return <DetailCharacterPageModule pk={pk} />;
}