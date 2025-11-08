interface IDescriptionProps {
  description: string;
}

export function MiniDescription(props: IDescriptionProps) {
  return (
    <section className="flex flex-col gap-1">
      {/* head */}
      <div className="flex items-center gap-1">
        <p className="mb-1 text-smp font-bold text-gray-400">توضیحات</p>
        <span className="h-px grow bg-[#e6e9ee]" />
      </div>
      {/* body */}
      <p className="text-smp font-medium text-gray-400 lg:text-sm">
        {props.description}
      </p>
    </section>
  );
}
