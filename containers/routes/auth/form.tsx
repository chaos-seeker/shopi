'use client';

import { auth } from '@/actions/auth/auth';
import { useApiCall } from '@/hooks/api-call';
import { cn } from '@/utils/cn';
import { zodResolver } from '@hookform/resolvers/zod';
import Image from 'next/image';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { z } from 'zod';

const formSchema = z.object({
  full_name: z
    .string()
    .min(1, 'نام کامل الزامی است')
    .regex(/^[\u0600-\u06FF\s]+$/, 'نام کامل باید فقط فارسی باشد'),
  username: z.string().min(1, 'نام کاربری الزامی است'),
  password: z.string().min(1, 'رمز عبور الزامی است'),
});

export function Form() {
  const [callApi, isLoadingSubmitBtn] = useApiCall();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      full_name: '',
      username: '',
      password: '',
    },
  });

  const handleSubmitForm = async (data: z.infer<typeof formSchema>) => {
    await callApi(auth(data), (result) => {
      const authResult = result as Awaited<ReturnType<typeof auth>>;
      if (!authResult.ok) {
        toast.error(authResult.error || 'خطایی رخ داد');
        return;
      }
      toast.success(
        authResult.status === 'registered'
          ? 'ثبت نام با موفقیت انجام شد'
          : 'ورود با موفقیت انجام شد',
      );
      form.reset();
    });
  };

  useEffect(() => {
    form.setFocus('full_name');
  }, [form]);

  return (
    <section className="flex w-[350px] flex-col gap-5 rounded-xl border bg-white p-4 sm:w-[350px]">
      <div className="flex items-center justify-between">
        <p className="font-bold text-gray-500">ورود / ثبت نام</p>
        <Image
          src="/images/routes/auth/logo.svg"
          alt="ورود"
          width={25}
          height={25}
        />
      </div>
      <form
        onSubmit={form.handleSubmit(handleSubmitForm)}
        className="flex flex-col gap-2"
      >
        <div className="flex flex-col gap-2.5">
          <div className="flex flex-col gap-2">
            <input
              type="text"
              spellCheck={false}
              className={cn(
                'w-full truncate font-medium rounded-md border p-2.5 border-gray-200 text-slate-500 bg-white text-smp placeholder:text-sm focus:border-red transition-colors',
                {
                  'border-red-500': form.formState.errors.full_name,
                },
              )}
              placeholder="نام کامل (فارسی)"
              {...form.register('full_name')}
            />
            <p className="text-sm text-red-500">
              {form.formState.errors.full_name?.message}
            </p>
          </div>
          <div className="flex flex-col gap-2">
            <input
              type="text"
              spellCheck={false}
              className={cn(
                'w-full truncate font-medium rounded-md border p-2.5 border-gray-200 text-slate-500 bg-white text-smp placeholder:text-sm focus:border-red transition-colors',
                {
                  'border-red-500': form.formState.errors.username,
                },
              )}
              placeholder="نام کاربری"
              {...form.register('username')}
            />
            <p className="text-sm text-red-500">
              {form.formState.errors.username?.message}
            </p>
          </div>
          <div className="flex flex-col gap-2">
            <input
              type="password"
              spellCheck={false}
              className={cn(
                'w-full truncate font-medium rounded-md border p-2.5 border-gray-200 text-slate-500 bg-white text-smp placeholder:text-sm focus:border-red transition-colors',
                {
                  'border-red-500': form.formState.errors.password,
                },
              )}
              placeholder="رمز عبور"
              {...form.register('password')}
            />
            <p className="text-sm text-red-500">
              {form.formState.errors.password?.message}
            </p>
          </div>
        </div>
        <button
          disabled={isLoadingSubmitBtn}
          className="mt-1 h-12 w-full justify-center rounded-lg bg-red font-medium text-white disabled:opacity-50"
        >
          ورود
        </button>
      </form>
    </section>
  );
}
