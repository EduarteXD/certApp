import { Box, Button, Paper } from '@mui/material'
import React from 'react'
import './DetailPage.css'
import Convert from 'ansi-to-html'
import { motion } from 'framer-motion'

const convert = new Convert()

const DetailPage = (props) => {
    const ws = props.ws

    const handleExec = (mode, domain) => {
        ws.emit('exec', { mode: mode, domain: domain })
    }

    React.useEffect(() => {
        if (ws) {
            ws.off('processexit')
            ws.off('stdout')

            ws.on('processexit', msg => {
                let component = document.createElement('span')
                component.innerText = `Process exited with code ${msg.code.exitCode}`
                component.setAttribute('class', 'info')

                let consoleView = document.getElementById('console')
                consoleView.appendChild(component)
                consoleView.scrollTop = consoleView.scrollHeight
            })

            ws.on('stdout', msg => {
                let component = document.createElement('span')
                component.innerHTML = convert.toHtml(msg.data).replace('#0A0', '#5C5').replace('#A00', '#C33')
                component.setAttribute('class', 'info')

                let consoleView = document.getElementById('console')
                consoleView.appendChild(component)
                consoleView.scrollTop = consoleView.scrollHeight
            })

            handleExec('issue', props.domain)
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <motion.div
            initial={{
                opacity: 0,
                transform: 'translate(-50%, -45%)'
            }}
            animate={{
                opacity: 1,
                transform: 'translate(-50%, -50%)'
            }}
            exit={{
                opacity: 0,
                transform: 'translate(-50%, -55%)'
            }}
            style={{
                width: '67%',
                height: '55%',
                margin: '0 auto',
                position: 'absolute',
                top: '45%',
                left: '50%'
            }}
        >
            <Box
                sx={{
                    width: '100%',
                    height: '100%'
                }}
            >
                <Paper
                    id="console"
                    sx={{
                        backgroundColor: '#222',
                        height: '100%',
                        overflow: 'scroll',
                        padding: '30px 40px'
                    }}
                >
                </Paper>
                <Button
                    onClick={() => {
                        handleExec('renew', props.domain)
                    }}
                    variant='outlined'
                    sx={{
                        margin: '10px 0'
                    }}
                >
                    我已完成解析
                </Button>
                <Button
                    onClick={() => {
                        // handleExec('renew', props.domain)
                        window.location.hash = '/'
                    }}
                    variant='outlined'
                    sx={{
                        margin: '10px 10px'
                    }}
                >
                    返回
                </Button>
            </Box>
        </motion.div>
    )
}

export default DetailPage