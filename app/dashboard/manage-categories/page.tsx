'use client';

import { deleteCategory } from '@/actions/category/delete-category';
import { ListCategories } from '@/containers/routes/dashboard/manage-categories/list-categories';
import { ModalCategory } from '@/containers/routes/dashboard/manage-categories/modal-category';
import { useApiCall } from '@/hooks/api-call';
import { useModal } from '@/hooks/modal';
import { useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import toast from 'react-hot-toast';

export default function Page() {
  const queryClient = useQueryClient();
  const [callApi] = useApiCall();
  const addCategoryModal = useModal('add-category');
  const editCategoryModal = useModal('edit-category');
  const [editCategoryId, setEditCategoryId] = useState<number | undefined>();

  const handleEditClick = (categoryId: number) => {
    setEditCategoryId(categoryId);
    editCategoryModal.show();
  };

  const handleDeleteClick = (categoryId: number) => {
    if (confirm('آیا از حذف این دسته‌بندی اطمینان دارید؟')) {
      callApi(deleteCategory(categoryId), (result) => {
        const deleteResult = result as Awaited<
          ReturnType<typeof deleteCategory>
        >;
        if (deleteResult.error) {
          toast.error(deleteResult.error);
          return;
        }
        toast.success('دسته‌بندی با موفقیت حذف شد');
        queryClient.invalidateQueries({ queryKey: ['categories'] });
      });
    }
  };

  return (
    <>
      <ListCategories
        onEditClick={handleEditClick}
        onDeleteClick={handleDeleteClick}
      />
      <ModalCategory
        isOpen={addCategoryModal.isShow}
        onClose={() => addCategoryModal.hide()}
        mode="create"
      />
      <ModalCategory
        isOpen={editCategoryModal.isShow}
        onClose={() => {
          editCategoryModal.hide();
          setEditCategoryId(undefined);
        }}
        mode="edit"
        categoryId={editCategoryId}
      />
    </>
  );
}
