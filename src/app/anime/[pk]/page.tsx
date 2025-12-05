import DetailAnimePageModule from '@/modules/DetailAnimePageModule';

type Props = {
  params: any
}

export default async function Page({ params }: Props) {
  const resolved = await params;
  const pk = resolved?.pk ?? '';
  return <DetailAnimePageModule pk={pk} />;
}