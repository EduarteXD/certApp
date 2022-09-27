import { Box, Button, Paper } from '@mui/material'
import React from 'react'
import './DetailPage.css'
import Convert from 'ansi-to-html'

const convert = new Convert()

const DetailPage = (props) => {
    const ws = props.ws
    const moveon = props.moveon

    const handleExec = (mode, domain) => {
        ws.emit('exec', { mode: mode, domain: domain })
    }

    React.useEffect(() => {
        if (ws) {
            ws.removeAlListeners('processexit')
            ws.removeAlListeners('stdout')

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
    }, [])

    return (
        <>
            <Box sx={{
                width: '67%',
                margin: '0 auto',
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)'
            }}>
                <Paper
                    id="console"
                    sx={{
                        backgroundColor: '#222',
                        height: '800px',
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
            </Box>
        </>
    )
}

export default DetailPage