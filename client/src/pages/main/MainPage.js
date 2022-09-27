import React from 'react'
import './MainPage.css'
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight'
import LockIcon from '@mui/icons-material/Lock'
import { Box, Icon, IconButton, InputBase, Paper } from '@mui/material'
import { motion } from 'framer-motion'

const MainPage = (props) => {
    // const ws = props.ws
    const moveon = props.moveon

    const [domain, setDomain] = React.useState('')

    const handleChange = (e) => {
        setDomain(e.target.value)
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        // console.log(domain)
        moveon(domain)
    }

    return (
        <motion.div
            className='main'
            initial={{ 
                opacity: 0,
                transform: 'translate(-50%, 50%)'
            }}
            animate={{ 
                opacity: 1,
                transform: 'translate(-50%, -50%)'
            }}
            exit={{ 
                opacity: 0,
                transform: 'translate(-50%, 50%)'
            }}
        >
            <Box>
                <Paper
                    component='form'
                    sx={{
                        alignItems: 'center',
                        width: '500px',
                        display: 'flex'
                    }}
                    onSubmit={handleSubmit}
                >
                    <Icon
                        sx={{
                            p: '10px',
                            color: '#5C5'
                        }}
                    >
                        <LockIcon />
                    </Icon>
                    <span style={{color: '#5C5'}}>https://</span>
                    <InputBase 
                        sx={{
                            ml: 1,
                            flex: 1,
                            p: '10px'
                        }}
                        inputProps={{'aria-label': '输入需要申请证书的域名来开始'}}
                        placeholder='输入需要申请证书的域名来开始'
                        onChange={handleChange}
                    />
                    <IconButton 
                        type='button'
                        sx={{
                            p: '10px'
                        }}
                        onClick={handleSubmit}
                        arialabel="提交"
                    >
                        <KeyboardArrowRightIcon />
                    </IconButton>
                </Paper>
            </Box>
        </motion.div>
    )
}

export default MainPage