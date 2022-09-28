import { Button } from '@mui/material'
import './ErrorPage.css'

const ErrorPage = () => {
    return (
        <div className='errorPage'>
            <h1>Oops!</h1>
            <p>页面未找到</p>
            <Button
                onClick={() => {
                    window.location.hash = '/'
                }}
            >
                返回主页
            </Button>
        </div>
    )
}

export default ErrorPage