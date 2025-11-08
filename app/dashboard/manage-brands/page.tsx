'use client';

import { deleteBrand } from '@/actions/brand/delete-brand';
import { ListBrands } from '@/containers/routes/dashboard/manage-brand/list-brands';
import { ModalBrand } from '@/containers/routes/dashboard/manage-brand/modal-brand';
import { useApiCall } from '@/hooks/api-call';
import { useModal } from '@/hooks/modal';
import { useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import toast from 'react-hot-toast';

export default function Page() {
  const queryClient = useQueryClient();
  const [callApi] = useApiCall();
  const addBrandModal = useModal('add-brand');
  const editBrandModal = useModal('edit-brand');
  const [editBrandId, setEditBrandId] = useState<number | undefined>();

  const handleEditClick = (brandId: number) => {
    setEditBrandId(brandId);
    editBrandModal.show();
  };

  const handleDeleteClick = (brandId: number) => {
    if (confirm('آیا از حذف این برند اطمینان دارید؟')) {
      callApi(deleteBrand(brandId), (result) => {
        const deleteResult = result as Awaited<ReturnType<typeof deleteBrand>>;
        if (deleteResult.error) {
          toast.error(deleteResult.error);
          return;
        }
        toast.success('برند با موفقیت حذف شد');
        queryClient.invalidateQueries({ queryKey: ['brands'] });
      });
    }
  };

  return (
    <>
      <ListBrands
        onEditClick={handleEditClick}
        onDeleteClick={handleDeleteClick}
      />
      <ModalBrand
        isOpen={addBrandModal.isShow}
        onClose={() => addBrandModal.hide()}
        mode="create"
      />
      <ModalBrand
        isOpen={editBrandModal.isShow}
        onClose={() => {
          editBrandModal.hide();
          setEditBrandId(undefined);
        }}
        mode="edit"
        brandId={editBrandId}
      />
    </>
  );
}

