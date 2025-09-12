interface IMiniAttributesProps {
  attributes: {
    key: string;
    value: string;
  }[];
}

export function MiniAttributes(props: IMiniAttributesProps) {
  return (
    <section className="flex min-w-40 flex-col gap-1">
      {/* head */}
      <div className="flex items-center gap-1">
        <p className="mb-1  text-smp font-bold text-gray-400">ویژگی ها</p>
        <span className="h-px grow bg-[#e6e9ee]" />
      </div>
      {/* body */}
      <div className="flex flex-col text-smp font-medium text-gray-400 lg:text-sm">
        {props.attributes.map((item) => {
          return (
            <div key={item.key} className="flex justify-between">
              <p className="text-gray-400">{item.key}</p>
              <p className="text-gray-500">{item.value}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
