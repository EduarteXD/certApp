import React from 'react'
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight'
import LockIcon from '@mui/icons-material/Lock'
import { 
    Box, 
    Icon, 
    IconButton, 
    InputBase, 
    Paper 
} from '@mui/material'
import { motion } from 'framer-motion'

import './MainPage.css'

const MainPage = (props) => {
    const moveon = props.moveon

    const [domain, setDomain] = React.useState('')

    const handleChange = (e) => {
        setDomain(e.target.value)
    }

    const handleSubmit = (e) => {
        if(e) {
            e.preventDefault()
        }
        moveon(domain)
    }

    return (
        <motion.div
            className='main'
            initial={{ 
                opacity: 0,
                y: '35vh'
            }}
            animate={{ 
                opacity: 1,
                y: '40vh'
            }}
            exit={{ 
                opacity: 0,
                y: '35vh'
            }}
        >
            <Box>
                <Paper
                    component='form'
                    sx={{
                        alignItems: 'center',
                        width: '30vw',
                        minWidth: '300px',
                        display: 'flex',
                        p: '2px 4px',
                        margin: '0 auto'
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
                        placeholder='输入域名来开始'
                        onChange={handleChange}
                    />
                    <IconButton
                        disabled={ !props.ready }
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