'use client'
import {GET} from '@/app/http/GET';
import IAddUnderwriter from '@/app/interfaces/underwriters/underwriter-add';
import { useQuery } from '@tanstack/react-query';
import React, { use } from 'react'
import AddUnderwriterForm from '../underwriter-components/AddUnderwriterForm';

const EditUnderwriter = ({ params }: { params: Promise<{ id: string }> }) => {

  const resolveParams = use(params)
  
  const { data, isLoading, error } = useQuery({
    queryKey: ["underwriters-"+resolveParams.id], // Unique key for caching
    queryFn: () => GET<IAddUnderwriter>("/underwriter/"+(+resolveParams.id)), // Function to fetch data
  });

  let children = <div>No Underwriter with id {resolveParams.id}</div>;
  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  if (data) {
    children = (
      <AddUnderwriterForm editUnderwriter={data}/>
    );
  }
  return (
    <div>
      {children}
    </div>
  )
}

export default EditUnderwriter
