'use client';

import { ListProducts } from '@/containers/routes/dashboard/manage-product/list-products';
import { ModalProduct } from '@/containers/routes/dashboard/manage-product/modal-product';
import { useModal } from '@/hooks/modal';
import { useState } from 'react';

export default function Page() {
  const addProductModal = useModal('add-product');
  const editProductModal = useModal('edit-product');
  const [editProductId, setEditProductId] = useState<number | undefined>();

  const handleSuccess = () => {
    // The products list will be refreshed automatically
    // through React Query's cache invalidation in ListProducts component
  };

  const handleEditClick = (productId: number) => {
    setEditProductId(productId);
    editProductModal.show();
  };

  return (
    <>
      <ListProducts onEditClick={handleEditClick} />
      <ModalProduct
        isOpen={addProductModal.isShow}
        onClose={() => addProductModal.hide()}
        onSuccess={handleSuccess}
        mode="create"
      />
      <ModalProduct
        isOpen={editProductModal.isShow}
        onClose={() => {
          editProductModal.hide();
          setEditProductId(undefined);
        }}
        onSuccess={handleSuccess}
        mode="edit"
        productId={editProductId}
      />
    </>
  );
}
