
export function InvoiceTableHeader() {
  return (
    <tr className="bg-[#2A3035]">
      <th className="align-center w-[33%] border-b p-4 py-2 pl-8 text-left text-[13px] font-bold uppercase text-white ">
        Item
      </th>
      <th className="align-center w-[16,75%] border-b p-4 py-2  pl-8 text-center text-[13px] font-bold uppercase text-white">
        Qty
      </th>
      <th className="w-[16,75%] border-b p-4 py-2 pl-8  text-center text-[13px] font-bold uppercase text-white">
        <span className="block"> Price </span>
        <span className="block" style={{ fontSize: '8px;important!' }}>
          (Per Unit)
        </span>
      </th>
      <th className="w-[16,75%] border-b p-4 py-2 pl-8  text-center text-[13px]  font-bold uppercase text-white">
        <span className="block">STAMP</span>
        <span className="block">TYPE</span>
      </th>
      <th className="align-center w-[16,75%] border-b p-4 py-2  pl-8 text-center text-[13px] font-bold uppercase leading-[15.23px] text-white">
        <span className="block">FEDERAL EXCISE</span>
        <span className="block" style={{ fontSize: '8px;important!' }}>
          (Per Unit)
        </span>
      </th>
      <th className="align-center w-[16,75%] border-b p-4 py-2  pl-8 text-center text-[13px] font-bold uppercase leading-[15.23px] text-white">
        <span className="block">PROVINCIAL EXCISE</span>
        <span className="block" style={{ fontSize: '8px;important!' }}>
          (Per Unit)
        </span>
      </th>
      <th className="align-center w-[16,75%] border-b p-4 py-2  pl-8 text-center text-[13px] font-bold uppercase leading-[15.23px] text-white">
        Subtotal
        <span className="block" style={{ fontSize: '8px;important!' }}>
          (With Excise)
        </span>
      </th>
    </tr>
  );
}
