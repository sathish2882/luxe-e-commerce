import {Table} from 'antd';
import type { TableProps } from 'antd';


type Props<T> = {
   columns: TableProps<T>["columns"]
   data: T[]
   pagination?: TableProps<T>["pagination"]
   onChange?: TableProps<T>["onChange"]
}


function TableComponent<T extends object>({columns, data,pagination,onChange}:Props<T>){
     return <div className='overflow-x-auto'><Table pagination={pagination} onChange={onChange} scroll={{x: "max-content"}} columns={columns} dataSource={data} /></div>
}

export default TableComponent;