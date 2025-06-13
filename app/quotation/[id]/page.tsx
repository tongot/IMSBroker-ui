"use client"
import MainContainer from '@/app/components/MainContainer'
import EditIcon from '@mui/icons-material/Edit'
import React, { use } from 'react'
import EditQuotation from '../quotation-components/EditQuotation'
import { useQuery } from '@tanstack/react-query'
import { GET } from '@/app/utils/http/GET'
import { IGetQuotationDto } from '@/app/api/ims-client'
import LoadingPage from '@/app/components/LoadingPage'

const EditQuotePage = ({params}:{params:Promise<{ id: string }>}) => {

  const resolveParams = use(params);
  
  //get quotation by id
  const { data, isLoading, error, isPending } = useQuery({
    queryKey: ["quotation-" + resolveParams.id], // Unique key for caching
    queryFn: () => GET<IGetQuotationDto>("/Quotation/get-quotation/" + (+resolveParams.id)), // Function to fetch data
  })


  const icon = <EditIcon sx={{ fontSize: 34 }} />
  return (
  <MainContainer heading={"Edit Quotation"} icon={icon}>
     {isLoading && <LoadingPage />}
     {!isPending && !data && !error && <div>No Quotation with id {resolveParams.id}</div>}
     {data && <EditQuotation quotation={data} loading={isPending}/>}
  </MainContainer>
  )
}
export default EditQuotePage
