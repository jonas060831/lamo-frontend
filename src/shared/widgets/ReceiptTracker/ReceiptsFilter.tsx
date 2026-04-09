import type { ParsedReceipt } from "../../../hooks/useReceipts"
import type { FiltersType } from "../../../pages/ReceiptTrackerPage"


import styles from './ReceiptsFilter.module.css'

const ReceiptsFilter = ({ filters, setFilters, receipts }: { filters: FiltersType, setFilters: (filters: any) => void, receipts: ParsedReceipt[] }) => {
  
  const companies = ["costco", "sams club", 'the home depot', 'abt', 'target', 'apple']
  console.log(receipts)


  
  return (
    <div className={styles.container}>
      
      {/* SORT BY COMPANY */}
      <select
       name="company"
       id="companyFilter"
       value={filters.company}
       onChange={(e) => setFilters((prev:any) => ({
        ...prev,
        company: e.target.value
       }))}
      >
        <option value="">All Store</option>
        {
          companies.map((company, i) => (
            <option key={i} value={company}>
              {company[0].toUpperCase() + company.slice(1)}
            </option>
          ))
        }
      </select>
      
      {/* SORT BY DATE Oldest Newest */}
      <select
       name="sortByDate"
       id="sortByDate"
       value={filters.sortByDate}
       onChange={(e) => {
        setFilters((prev:any) => ({
        ...prev,
        sortByDate: e.target.value
        }))


       }}
      >
        <option value="newest">Newest</option>
        <option value="oldest">Oldest</option>
      </select>
      </div>
  )
}

export default ReceiptsFilter