'use client';

import { auth } from '@/actions/auth/auth';
import { Input } from '@/components/input';
import { useApiCall } from '@/hooks/api-call';
import { userSlice } from '@/slices/user';
import { zodResolver } from '@hookform/resolvers/zod';
import { useKillua } from 'killua';
import { Loader2 } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Controller, useForm } from 'react-hook-form';
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
  const router = useRouter();
  const [callApi, isLoadingSubmitBtn] = useApiCall();
  const user = useKillua(userSlice);
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
        toast.error(authResult.error!);
        return;
      }
      user.set(authResult.user);
      toast.success(
        authResult.status === 'registered'
          ? 'ثبت نام با موفقیت انجام شد'
          : 'ورود با موفقیت انجام شد',
      );
      form.reset();
      router.push('/');
    });
  };

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
          <Controller
            control={form.control}
            name="full_name"
            render={({ field, fieldState }) => (
              <Input
                type="text"
                placeholder="نام و نام خانوادگی"
                error={fieldState.error?.message}
                {...field}
              />
            )}
          />
          <Controller
            control={form.control}
            name="username"
            render={({ field, fieldState }) => (
              <Input
                type="text"
                placeholder="نام کاربری"
                error={fieldState.error?.message}
                {...field}
              />
            )}
          />
          <Controller
            control={form.control}
            name="password"
            render={({ field, fieldState }) => (
              <Input
                type="password"
                placeholder="رمز عبور"
                error={fieldState.error?.message}
                {...field}
              />
            )}
          />
        </div>
        <button
          disabled={isLoadingSubmitBtn}
          className="mt-1 flex h-12 w-full items-center justify-center rounded-lg bg-red font-medium text-white disabled:opacity-50"
        >
          {isLoadingSubmitBtn ? <Loader2 className="animate-spin" /> : 'ورود'}
        </button>
      </form>
    </section>
  );
}
