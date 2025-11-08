'use client';

import { createBrand } from '@/actions/brand/create-brand';
import { getBrand } from '@/actions/brand/get-brand';
import { updateBrand } from '@/actions/brand/update-brand';
import { Input } from '@/components/input';
import { InputImage } from '@/components/input-image';
import { Label } from '@/components/label';
import { Modal } from '@/components/modal';
import { useApiCall } from '@/hooks/api-call';
import { TBrand } from '@/types/brand';
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

interface IModalBrandProps {
  isOpen: boolean;
  onClose: () => void;
  mode: 'create' | 'edit';
  brandId?: number;
}

export function ModalBrand({
  isOpen,
  onClose,
  mode,
  brandId,
}: IModalBrandProps) {
  const queryClient = useQueryClient();
  const [callApi, isLoadingSubmitBtn] = useApiCall();
  const [imageFile, setImageFile] = useState<File | null>(null);

  const { data: brandData, isLoading: isLoadingBrand } = useQuery({
    queryKey: ['brand', brandId],
    queryFn: async () => {
      if (!brandId) return null;
      const result = await getBrand(brandId);
      if (result.error) throw new Error(result.error);
      return result.data;
    },
    enabled: isOpen && mode === 'edit' && !!brandId,
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
    if (mode === 'edit' && brandData) {
      const brand = brandData as TBrand;
      form.reset({
        image: brand.image,
        name_fa: brand.name_fa,
        name_en: brand.name_en,
        slug: brand.slug,
      });
    }
  }, [brandData, mode, form]);

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

    const brandFormData = {
      ...data,
      image: imageUrl,
    };

    if (mode === 'create') {
      await callApi(createBrand(brandFormData), (result) => {
        const createResult = result as Awaited<ReturnType<typeof createBrand>>;
        if (createResult.error) {
          toast.error(createResult.error);
          return;
        }
        toast.success('برند با موفقیت ایجاد شد');
        queryClient.invalidateQueries({ queryKey: ['brands'] });
        form.reset();
        setImageFile(null);
        onClose();
      });
    } else if (mode === 'edit' && brandId) {
      await callApi(updateBrand(brandId, brandFormData), (result) => {
        const updateResult = result as Awaited<ReturnType<typeof updateBrand>>;
        if (updateResult.error) {
          toast.error(updateResult.error);
          return;
        }
        toast.success('برند با موفقیت به‌روزرسانی شد');
        queryClient.invalidateQueries({ queryKey: ['brands'] });
        queryClient.invalidateQueries({ queryKey: ['brand', brandId] });
        form.reset();
        setImageFile(null);
        onClose();
      });
    }
  };

  if (!isOpen) return null;

  if (mode === 'edit' && isLoadingBrand) {
    return (
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        title="ویرایش برند"
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
      title={mode === 'create' ? 'افزودن برند' : 'ویرایش برند'}
      footer={
        <button
          type="submit"
          form="brand-form"
          disabled={isLoadingSubmitBtn}
          className="flex-1 rounded-lg bg-red px-4 py-3 font-medium text-white disabled:opacity-50"
        >
          {isLoadingSubmitBtn ? (
            <Loader2 className="mx-auto animate-spin" />
          ) : mode === 'create' ? (
            'افزودن برند'
          ) : (
            'ویرایش برند'
          )}
        </button>
      }
      className="max-w-[350px] sm:max-w-[500px] md:max-w-[700px] lg:max-w-[900px]"
    >
      <form
        id="brand-form"
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
