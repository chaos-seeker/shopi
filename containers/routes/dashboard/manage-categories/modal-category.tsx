'use client';

import { createCategory } from '@/actions/category/create-category';
import { getCategory } from '@/actions/category/get-category';
import { updateCategory } from '@/actions/category/update-category';
import { Input } from '@/components/input';
import { InputImage } from '@/components/input-image';
import { Label } from '@/components/label';
import { Modal } from '@/components/modal';
import { useApiCall } from '@/hooks/api-call';
import { TCategory } from '@/types/category';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { z } from 'zod';

const formSchema = z.object({
  image: z.string().min(1, 'تصویر الزامی است'),
  name_fa: z.string().min(1, 'نام فارسی الزامی است'),
  name_en: z.string().min(1, 'نام انگلیسی الزامی است'),
  slug: z.string().min(1, 'اسلاگ الزامی است'),
});

type FormData = z.infer<typeof formSchema>;

interface IModalCategoryProps {
  isOpen: boolean;
  onClose: () => void;
  mode: 'create' | 'edit';
  categoryId?: number;
}

export function ModalCategory({
  isOpen,
  onClose,
  mode,
  categoryId,
}: IModalCategoryProps) {
  const queryClient = useQueryClient();
  const [callApi, isLoadingSubmitBtn] = useApiCall();
  const [imageFile, setImageFile] = useState<File | null>(null);

  const { data: categoryData, isLoading: isLoadingCategory } = useQuery({
    queryKey: ['category', categoryId],
    queryFn: async () => {
      if (!categoryId) return null;
      const result = await getCategory(categoryId);
      if (result.error) throw new Error(result.error);
      return result.data;
    },
    enabled: isOpen && mode === 'edit' && !!categoryId,
  });

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      image: '',
      name_fa: '',
      name_en: '',
      slug: '',
    },
  });

  useEffect(() => {
    if (!isOpen) {
      form.reset();
      setImageFile(null);
    }
  }, [isOpen, form]);

  useEffect(() => {
    if (mode === 'edit' && categoryData) {
      const category = categoryData as TCategory;
      form.reset({
        image: category.image,
        name_fa: category.name_fa,
        name_en: category.name_en,
        slug: category.slug,
      });
    }
  }, [categoryData, mode, form]);

  const convertFileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleSubmitForm = async (data: FormData) => {
    let imageUrl = data.image;

    if (imageFile) {
      imageUrl = await convertFileToBase64(imageFile);
    }

    const categoryFormData = {
      ...data,
      image: imageUrl,
    };

    if (mode === 'create') {
      await callApi(createCategory(categoryFormData), (result) => {
        const createResult = result as Awaited<
          ReturnType<typeof createCategory>
        >;
        if (createResult.error) {
          toast.error(createResult.error);
          return;
        }
        toast.success('دسته‌بندی با موفقیت ایجاد شد');
        queryClient.invalidateQueries({ queryKey: ['categories'] });
        form.reset();
        setImageFile(null);
        onClose();
      });
    } else if (mode === 'edit' && categoryId) {
      await callApi(updateCategory(categoryId, categoryFormData), (result) => {
        const updateResult = result as Awaited<
          ReturnType<typeof updateCategory>
        >;
        if (updateResult.error) {
          toast.error(updateResult.error);
          return;
        }
        toast.success('دسته‌بندی با موفقیت به‌روزرسانی شد');
        queryClient.invalidateQueries({ queryKey: ['categories'] });
        queryClient.invalidateQueries({ queryKey: ['category', categoryId] });
        form.reset();
        setImageFile(null);
        onClose();
      });
    }
  };

  if (!isOpen) return null;

  if (mode === 'edit' && isLoadingCategory) {
    return (
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        title="ویرایش دسته‌بندی"
        className="max-w-[350px] sm:max-w-[500px] md:max-w-[700px]"
      >
        <div className="flex items-center justify-center py-12">
          <Loader2 className="animate-spin text-gray-400" size={32} />
        </div>
      </Modal>
    );
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={mode === 'create' ? 'افزودن دسته‌بندی' : 'ویرایش دسته‌بندی'}
      footer={
        <button
          type="submit"
          form="category-form"
          disabled={isLoadingSubmitBtn}
          className="flex-1 rounded-lg bg-red px-4 py-3 font-medium text-white disabled:opacity-50"
        >
          {isLoadingSubmitBtn ? (
            <Loader2 className="mx-auto animate-spin" />
          ) : mode === 'create' ? (
            'افزودن دسته‌بندی'
          ) : (
            'ویرایش دسته‌بندی'
          )}
        </button>
      }
      className="max-w-[350px] sm:max-w-[500px] md:max-w-[700px] lg:max-w-[900px]"
    >
      <form
        id="category-form"
        onSubmit={form.handleSubmit(handleSubmitForm)}
        className="flex flex-col gap-4"
      >
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="md:col-span-2">
            <Label>تصویر</Label>
            <Controller
              control={form.control}
              name="image"
              render={({ field, fieldState }) => (
                <InputImage
                  error={fieldState.error?.message}
                  onChange={async (file) => {
                    if (file) {
                      setImageFile(file);
                      const base64 = await convertFileToBase64(file);
                      field.onChange(base64);
                    } else {
                      setImageFile(null);
                      field.onChange('');
                    }
                  }}
                  preview={field.value || undefined}
                />
              )}
            />
          </div>

          <div>
            <Label>نام فارسی</Label>
            <Controller
              control={form.control}
              name="name_fa"
              render={({ field, fieldState }) => (
                <Input
                  type="text"
                  error={fieldState.error?.message}
                  {...field}
                />
              )}
            />
          </div>

          <div>
            <Label>نام انگلیسی</Label>
            <Controller
              control={form.control}
              name="name_en"
              render={({ field, fieldState }) => (
                <Input
                  type="text"
                  error={fieldState.error?.message}
                  {...field}
                />
              )}
            />
          </div>

          <div className="md:col-span-2">
            <Label>اسلاگ</Label>
            <Controller
              control={form.control}
              name="slug"
              render={({ field, fieldState }) => (
                <Input
                  type="text"
                  error={fieldState.error?.message}
                  {...field}
                />
              )}
            />
          </div>
        </div>
      </form>
    </Modal>
  );
}
