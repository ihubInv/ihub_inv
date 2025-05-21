// import RequestPage from './RequestPageClient'

// export default function Page({ params }: { params: { id: string } }) {
//   debugger
//   console.log("params",params)
//   return <RequestPage id={params.id} />
// }



import RequestPage from './RequestPageClient'

export default async function Page({ params }: { params: { id: string } }) {
  const resolvedParams = await params;
  return <RequestPage id={resolvedParams.id} />
}
