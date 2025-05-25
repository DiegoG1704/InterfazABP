import { Dialog } from 'primereact/dialog'
import "./CustomDialog.css"

const CustomDialog = ({footer,visible,onhide,children,title,iconClassName,width="500px",height="auto",header}) => {
    const headerTemplate = () => {
        return (
            <div className='flex flex-row gap-2 align-items-center custom-dialog-header'>
                <span className={`${iconClassName} header-icon`} style={{fontSize:"22px",fontWeight:"500",color:"#fff"}}></span>
                <span style={{fontSize:"20px",fontWeight:"600"}}>{title}</span>
            </div>
        )
    }
    return (
        <Dialog visible={visible} style={{ width: width,height:height}} header={header?header:headerTemplate} onHide={onhide}footer={footer} key={1}>
            {children}
        </Dialog>
    )
}

export default CustomDialog
