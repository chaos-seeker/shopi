'use client';

import { getAllBrands } from '@/actions/brand/get-all-brands';
import { getAllCategories } from '@/actions/category/get-all-categories';
import { createProduct } from '@/actions/product/create-product';
import { getProduct } from '@/actions/product/get-product';
import { updateProduct } from '@/actions/product/update-product';
import { Input } from '@/components/input';
import { InputImage } from '@/components/input-image';
import { Label } from '@/components/label';
import { Modal } from '@/components/modal';
import { useApiCall } from '@/hooks/api-call';
import { TBrand } from '@/types/brand';
import { TCategory } from '@/types/category';
import { TProduct } from '@/types/product';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Loader2, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Controller, useFieldArray, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { z } from 'zod';

const formSchema = z.object({
  image: z.string().min(1, 'تصویر اصلی الزامی است'),
  gallery: z.array(z.string()).min(1, 'حداقل یک تصویر در گالری الزامی است'),
  category: z
    .object({
      id: z.number(),
      name_fa: z.string(),
      name_en: z.string(),
      slug: z.string(),
      image: z.string(),
    })
    .refine((val) => val.id > 0, 'دسته‌بندی الزامی است'),
  brand: z
    .object({
      id: z.number(),
      name_fa: z.string(),
      name_en: z.string(),
      slug: z.string(),
      image: z.string(),
    })
    .refine((val) => val.id > 0, 'برند الزامی است'),
  name_fa: z.string().min(1, 'نام فارسی الزامی است'),
  name_en: z.string().min(1, 'نام انگلیسی الزامی است'),
  slug: z.string().min(1, 'اسلاگ الزامی است'),
  quantity: z.number().min(0, 'موجودی باید بیشتر یا مساوی صفر باشد'),
  property: z.array(
    z.object({
      key: z.string().min(1, 'کلید الزامی است'),
      value: z.string().min(1, 'مقدار الزامی است'),
    }),
  ),
  description: z.string().min(1, 'توضیحات الزامی است'),
  price: z.number().min(0, 'قیمت باید بیشتر یا مساوی صفر باشد'),
  discount: z.number().min(0).max(100, 'تخفیف باید بین 0 تا 100 باشد'),
});

type FormData = z.infer<typeof formSchema>;

interface IModalProductProps {
  isOpen: boolean;
  onClose: () => void;
  mode: 'create' | 'edit';
  productId?: number;
}

export function ModalProduct({
  isOpen,
  onClose,
  mode,
  productId,
}: IModalProductProps) {
  const queryClient = useQueryClient();
  const [callApi, isLoadingSubmitBtn] = useApiCall();
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [galleryFiles, setGalleryFiles] = useState<File[]>([]);
  const [galleryPreviews, setGalleryPreviews] = useState<string[]>([]);

  const { data: categoriesData } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const result = await getAllCategories();
      if (result.error) throw new Error(result.error);
      return result.data;
    },
    enabled: isOpen,
  });

  const { data: brandsData } = useQuery({
    queryKey: ['brands'],
    queryFn: async () => {
      const result = await getAllBrands();
      if (result.error) throw new Error(result.error);
      return result.data;
    },
    enabled: isOpen,
  });

  const { data: productData, isLoading: isLoadingProduct } = useQuery({
    queryKey: ['product', productId],
    queryFn: async () => {
      if (!productId) return null;
      const result = await getProduct(productId);
      if (result.error) throw new Error(result.error);
      return result.data;
    },
    enabled: isOpen && mode === 'edit' && !!productId,
  });

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      image: '',
      gallery: [],
      category: {
        id: 0,
        name_fa: '',
        name_en: '',
        slug: '',
        image: '',
      },
      brand: {
        id: 0,
        name_fa: '',
        name_en: '',
        slug: '',
        image: '',
      },
      name_fa: '',
      name_en: '',
      slug: '',
      quantity: undefined as any,
      property: [{ key: '', value: '' }],
      description: '',
      price: undefined as any,
      discount: undefined as any,
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'property',
  });

  useEffect(() => {
    if (!isOpen) {
      form.reset();
      setImageFile(null);
      setGalleryFiles([]);
      setGalleryPreviews([]);
    }
  }, [isOpen, form]);

  useEffect(() => {
    if (mode === 'edit' && productData) {
      const product = productData as TProduct;
      form.reset({
        image: product.image,
        gallery: product.gallery,
        category: product.category,
        brand: product.brand,
        name_fa: product.name_fa,
        name_en: product.name_en,
        slug: product.slug,
        quantity: product.quantity,
        property:
          product.property && product.property.length > 0
            ? product.property
            : [{ key: '', value: '' }],
        description: product.description,
        price: product.price,
        discount: product.discount,
      });
      setGalleryPreviews(product.gallery);
    }
  }, [productData, mode, form]);

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
    let galleryUrls = data.gallery.length > 0 ? data.gallery : galleryPreviews;

    if (imageFile) {
      imageUrl = await convertFileToBase64(imageFile);
    }

    if (galleryFiles.length > 0 && galleryUrls.length === 0) {
      galleryUrls = await Promise.all(
        galleryFiles.map((file) => convertFileToBase64(file)),
      );
    }

    const productData = {
      ...data,
      image: imageUrl,
      gallery: galleryUrls,
      category: data.category as TCategory,
      brand: data.brand as TBrand,
    };

    if (mode === 'create') {
      await callApi(createProduct(productData), (result) => {
        const createResult = result as Awaited<
          ReturnType<typeof createProduct>
        >;
        if (createResult.error) {
          toast.error(createResult.error);
          return;
        }
        toast.success('محصول با موفقیت ایجاد شد');
        queryClient.invalidateQueries({ queryKey: ['products'] });
        form.reset();
        setImageFile(null);
        setGalleryFiles([]);
        setGalleryPreviews([]);
        onClose();
      });
    } else if (mode === 'edit' && productId) {
      await callApi(updateProduct(productId, productData), (result) => {
        const updateResult = result as Awaited<
          ReturnType<typeof updateProduct>
        >;
        if (updateResult.error) {
          toast.error(updateResult.error);
          return;
        }
        toast.success('محصول با موفقیت به‌روزرسانی شد');
        queryClient.invalidateQueries({ queryKey: ['products'] });
        queryClient.invalidateQueries({ queryKey: ['product', productId] });
        form.reset();
        setImageFile(null);
        setGalleryFiles([]);
        setGalleryPreviews([]);
        onClose();
      });
    }
  };

  if (!isOpen) return null;

  if (mode === 'edit' && isLoadingProduct) {
    return (
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        title="ویرایش محصول"
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
      title={mode === 'create' ? 'افزودن محصول' : 'ویرایش محصول'}
      footer={
        <button
          type="submit"
          form="product-form"
          disabled={isLoadingSubmitBtn}
          className="flex-1 rounded-lg bg-red px-4 py-3 font-medium text-white disabled:opacity-50"
        >
          {isLoadingSubmitBtn ? (
            <Loader2 className="mx-auto animate-spin" />
          ) : mode === 'create' ? (
            'افزودن محصول'
          ) : (
            'ویرایش محصول'
          )}
        </button>
      }
      className="max-w-[350px] sm:max-w-[500px] md:max-w-[700px] lg:max-w-[900px]"
    >
      <form
        id="product-form"
        onSubmit={form.handleSubmit(handleSubmitForm)}
        className="flex flex-col gap-4"
      >
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="md:col-span-2">
            <Label>تصویر اصلی</Label>
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

          <div className="md:col-span-2">
            <Label>گالری تصاویر</Label>
            <div className="flex flex-col gap-2">
              {galleryPreviews.map((preview, index) => (
                <div key={index} className="flex gap-2">
                  <div className="flex-1">
                    <InputImage
                      onChange={async (file) => {
                        if (file) {
                          const newFiles = [...galleryFiles];
                          newFiles[index] = file;
                          setGalleryFiles(newFiles);
                          const base64 = await convertFileToBase64(file);
                          const newPreviews = [...galleryPreviews];
                          newPreviews[index] = base64;
                          setGalleryPreviews(newPreviews);
                          const currentGallery = form.getValues('gallery');
                          currentGallery[index] = base64;
                          form.setValue('gallery', currentGallery);
                        } else {
                          const newFiles = [...galleryFiles];
                          newFiles.splice(index, 1);
                          setGalleryFiles(newFiles);
                          const newPreviews = [...galleryPreviews];
                          newPreviews.splice(index, 1);
                          setGalleryPreviews(newPreviews);
                          const currentGallery = form.getValues('gallery');
                          currentGallery.splice(index, 1);
                          form.setValue('gallery', currentGallery);
                        }
                      }}
                      preview={preview}
                    />
                  </div>
                </div>
              ))}
              <button
                type="button"
                onClick={async () => {
                  const input = document.createElement('input');
                  input.type = 'file';
                  input.accept = 'image/*';
                  input.onchange = async (e) => {
                    const file = (e.target as HTMLInputElement).files?.[0];
                    if (file) {
                      const base64 = await convertFileToBase64(file);
                      setGalleryFiles([...galleryFiles, file]);
                      setGalleryPreviews([...galleryPreviews, base64]);
                      const currentGallery = form.getValues('gallery');
                      currentGallery.push(base64);
                      form.setValue('gallery', currentGallery);
                    }
                  };
                  input.click();
                }}
                className="rounded-md border bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                افزودن تصویر به گالری
              </button>
              {form.formState.errors.gallery && (
                <p className="text-sm text-red-500">
                  {form.formState.errors.gallery.message}
                </p>
              )}
            </div>
          </div>

          <div className="md:col-span-2">
            <Label>دسته‌بندی</Label>
            <Controller
              control={form.control}
              name="category"
              render={({ field, fieldState }) => (
                <div className="flex flex-col gap-2">
                  <select
                    value={field.value.id}
                    onChange={(e) => {
                      const selectedCategory = categoriesData?.find(
                        (cat) => cat.id === Number(e.target.value),
                      );
                      if (selectedCategory) {
                        field.onChange(selectedCategory);
                      }
                    }}
                    className="w-full rounded-md border border-gray-200 p-[9px] text-sm font-medium text-slate-500 focus:border-red"
                  >
                    <option value={0}>انتخاب دسته‌بندی</option>
                    {categoriesData?.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name_fa}
                      </option>
                    ))}
                  </select>
                  {fieldState.error && (
                    <p className="text-sm text-red-500">
                      {fieldState.error.message}
                    </p>
                  )}
                </div>
              )}
            />
          </div>

          <div className="md:col-span-2">
            <Label>برند</Label>
            <Controller
              control={form.control}
              name="brand"
              render={({ field, fieldState }) => (
                <div className="flex flex-col gap-2">
                  <select
                    value={field.value.id}
                    onChange={(e) => {
                      const selectedBrand = brandsData?.find(
                        (brand) => brand.id === Number(e.target.value),
                      );
                      if (selectedBrand) {
                        field.onChange(selectedBrand);
                      }
                    }}
                    className="w-full rounded-md border border-gray-200 p-[9px] text-sm font-medium text-slate-500 focus:border-red"
                  >
                    <option value={0}>انتخاب برند</option>
                    {brandsData?.map((brand) => (
                      <option key={brand.id} value={brand.id}>
                        {brand.name_fa}
                      </option>
                    ))}
                  </select>
                  {fieldState.error && (
                    <p className="text-sm text-red-500">
                      {fieldState.error.message}
                    </p>
                  )}
                </div>
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

          <div>
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

          <div>
            <Label>موجودی</Label>
            <Controller
              control={form.control}
              name="quantity"
              render={({ field, fieldState }) => (
                <Input
                  type="number"
                  error={fieldState.error?.message}
                  {...field}
                  onChange={(e) => field.onChange(Number(e.target.value))}
                />
              )}
            />
          </div>

          <div>
            <Label>قیمت</Label>
            <Controller
              control={form.control}
              name="price"
              render={({ field, fieldState }) => (
                <Input
                  type="number"
                  error={fieldState.error?.message}
                  {...field}
                  onChange={(e) => field.onChange(Number(e.target.value))}
                />
              )}
            />
          </div>

          <div>
            <Label>تخفیف (%)</Label>
            <Controller
              control={form.control}
              name="discount"
              render={({ field, fieldState }) => (
                <Input
                  type="number"
                  error={fieldState.error?.message}
                  {...field}
                  onChange={(e) => field.onChange(Number(e.target.value))}
                />
              )}
            />
          </div>

          <div className="md:col-span-2">
            <Label>توضیحات</Label>
            <Controller
              control={form.control}
              name="description"
              render={({ field, fieldState }) => (
                <div className="flex flex-col gap-2">
                  <textarea
                    {...field}
                    rows={4}
                    className="w-full rounded-md border border-gray-200 p-[9px] text-sm font-medium text-slate-500 focus:border-red"
                  />
                  {fieldState.error && (
                    <p className="text-sm text-red-500">
                      {fieldState.error.message}
                    </p>
                  )}
                </div>
              )}
            />
          </div>

          <div className="md:col-span-2">
            <Label>ویژگی‌ها</Label>
            <div className="flex flex-col gap-2">
              {fields.map((field, index) => (
                <div key={field.id} className="flex gap-2">
                  <div className="flex-1">
                    <Label>کلید</Label>
                    <Controller
                      control={form.control}
                      name={`property.${index}.key`}
                      render={({ field: keyField, fieldState }) => (
                        <Input
                          type="text"
                          error={fieldState.error?.message}
                          {...keyField}
                        />
                      )}
                    />
                  </div>
                  <div className="flex-1">
                    <Label>مقدار</Label>
                    <Controller
                      control={form.control}
                      name={`property.${index}.value`}
                      render={({ field: valueField, fieldState }) => (
                        <Input
                          type="text"
                          error={fieldState.error?.message}
                          {...valueField}
                        />
                      )}
                    />
                  </div>
                  {fields.length > 1 && (
                    <button
                      type="button"
                      onClick={() => remove(index)}
                      className="rounded-md bg-red p-2 text-white"
                    >
                      <X size={16} />
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={() => append({ key: '', value: '' })}
                className="rounded-md border bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                افزودن ویژگی
              </button>
            </div>
          </div>
        </div>
      </form>
    </Modal>
  );
}
