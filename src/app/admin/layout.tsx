import SideNav from "@/components/SideNav"
import { ReactNode } from "react"
import styles from "@/app/page.module.css"

const Adminlayout = ({children}:{children:ReactNode}) => {
  return (
    <div>
        <SideNav/>
        {children}
    </div>
  )
}

export default Adminlayout