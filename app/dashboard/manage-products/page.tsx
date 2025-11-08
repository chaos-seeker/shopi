'use client';

import { deleteProduct } from '@/actions/product/delete-product';
import { ListProducts } from '@/containers/routes/dashboard/manage-product/list-products';
import { ModalProduct } from '@/containers/routes/dashboard/manage-product/modal-product';
import { useApiCall } from '@/hooks/api-call';
import { useModal } from '@/hooks/modal';
import { useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import toast from 'react-hot-toast';

export default function Page() {
  const queryClient = useQueryClient();
  const [callApi] = useApiCall();
  const addProductModal = useModal('add-product');
  const editProductModal = useModal('edit-product');
  const [editProductId, setEditProductId] = useState<number | undefined>();

  const handleEditClick = (productId: number) => {
    setEditProductId(productId);
    editProductModal.show();
  };

  const handleDeleteClick = (productId: number) => {
    if (confirm('آیا از حذف این محصول اطمینان دارید؟')) {
      callApi(deleteProduct(productId), (result) => {
        const deleteResult = result as Awaited<
          ReturnType<typeof deleteProduct>
        >;
        if (deleteResult.error) {
          toast.error(deleteResult.error);
          return;
        }
        toast.success('محصول با موفقیت حذف شد');
        queryClient.invalidateQueries({ queryKey: ['products'] });
      });
    }
  };

  return (
    <>
      <ListProducts
        onEditClick={handleEditClick}
        onDeleteClick={handleDeleteClick}
      />
      <ModalProduct
        isOpen={addProductModal.isShow}
        onClose={() => addProductModal.hide()}
        mode="create"
      />
      <ModalProduct
        isOpen={editProductModal.isShow}
        onClose={() => {
          editProductModal.hide();
          setEditProductId(undefined);
        }}
        mode="edit"
        productId={editProductId}
      />
    </>
  );
}
