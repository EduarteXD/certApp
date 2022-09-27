import { Box, Button, CircularProgress, Paper, Typography, Icon, IconButton } from '@mui/material'
import React from 'react'
import './DetailPage.css'
import Convert from 'ansi-to-html'
import { motion, AnimatePresence } from 'framer-motion'
import DnsIcon from '@mui/icons-material/Dns'
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong'
import ContentCopyIcon from '@mui/icons-material/ContentCopy'

const convert = new Convert()

const DetailPage = (props) => {
    const ws = props.ws
    const consoleViewRef = React.useRef(0)
    const normalViewRef = React.useRef(0)
    const pendingResolve = React.useRef({
        domains: [],
        records: []
    })

    // const [code, setCode] = React.useState(-1)
    const [toShow, setToShow] = React.useState({
        code: -1
    })

    const handleExec = (mode, domain) => {
        ws.emit('exec', { mode: mode, domain: domain })
    }

    React.useEffect(() => {
        if (ws) {
            ws.off('processexit')
            ws.off('stdout')

            ws.on('processexit', msg => {
                /**
                 * Codes:
                 * 0: 成功认证
                 * 1: 失败
                 * 2: 原证书仍有效
                 * 3: 需要验证域名，使用renew
                 */
                setToShow({
                    code: msg.code.exitCode,
                    pendingResolve: pendingResolve.current
                })
                pendingResolve.current = {
                    domains: [],
                    records: []
                }
            })

            ws.on('stdout', msg => {
                let component = document.createElement('span')
                component.innerHTML = convert.toHtml(msg.data).replace('#0A0', '#5C5').replace('#A00', '#C33')
                component.setAttribute('class', 'info')

                let consoleView = document.getElementById('console')
                consoleView.appendChild(component)
                consoleView.scrollTop = consoleView.scrollHeight

                let rawOutput = msg.data.replace(/\x1B\[([0-9]{1,2}(;[0-9]{1,2})?)?[m|K]/g, '')

                if (rawOutput.match(/Domain: '([0-9a-zA-z_.-]*)'/)) {
                    let reg = /Domain: '([0-9a-zA-z_.-]*)'/
                    let domain = reg.exec(rawOutput)[1]
                    pendingResolve.current = {
                        domains: [...pendingResolve.current.domains, domain],
                        records: [...pendingResolve.current.records]
                    }
                }

                if (rawOutput.match(/TXT value: '([0-9a-zA-z_.-]*)'/)) {
                    let reg = /TXT value: '([0-9a-zA-z_.-]*)'/
                    let record = reg.exec(rawOutput)[1]
                    pendingResolve.current = {
                        domains: [...pendingResolve.current.domains],
                        records: [...pendingResolve.current.records, record]
                    }
                }
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
                <Button
                    variant='outlined'
                    sx={{
                        margin: '10px 0'
                    }}
                    onClick={() => {
                        if (normalViewRef.current.style.height === '0px') {
                            consoleViewRef.current.style.height = '0px'
                            consoleViewRef.current.style.padding = '0 40px'
                            normalViewRef.current.style.height = '100%'
                            normalViewRef.current.style.padding = '30px 40px'
                        } else {
                            consoleViewRef.current.style.height = '100%'
                            consoleViewRef.current.style.padding = '30px 40px'
                            normalViewRef.current.style.height = '0px'
                            normalViewRef.current.style.padding = '0 40px'
                        }
                    }}
                >
                    切换视图
                </Button>
                <Paper
                    sx={{
                        backgroundColor: '#eee',
                        height: '100%',
                        overflow: 'scroll',
                        padding: '30px 40px',
                        transition: 'all 0.2s'
                    }}
                    ref={normalViewRef}
                >
                    {
                        toShow.code === -1 && (
                            <Box
                                sx={{
                                    textAlign: 'center'
                                }}
                            >
                                <CircularProgress sx={{
                                    margin: '10px 0 20px 0'
                                }} />
                                <Typography>
                                    等待服务器响应
                                </Typography>
                            </Box>
                        )
                    }
                    {
                        toShow.code === 3 && (
                            <>
                                <Typography
                                    variant='h4'
                                    sx={{
                                        padding: '0 20px 20px 0'
                                    }}
                                >
                                    请设置TXT记录：
                                </Typography>
                                <AnimatePresence mode='wait'>
                                    {
                                        toShow.pendingResolve.domains?.map((value, index) => (
                                            <motion.span 
                                                key={index}
                                                initial={{ 
                                                    opacity: 0,
                                                    y: 10
                                                }}
                                                animate={{ 
                                                    opacity: 1,
                                                    y: 0
                                                }}
                                                exit={{ 
                                                    opacity: 0,
                                                    y: -10
                                                }}
                                            >
                                                <Paper
                                                    sx={{
                                                        alignItems: 'center',
                                                        display: 'flex',
                                                        p: '2px 4px',
                                                        margin: '10px 20px'
                                                    }}
                                                >
                                                    <Icon
                                                        sx={{
                                                            p: '10px',
                                                            color: '#333'
                                                        }}
                                                    >
                                                        <DnsIcon />
                                                    </Icon>
                                                    <Typography
                                                        sx={{
                                                            flex: 1
                                                        }}
                                                    >
                                                        域名：{toShow.pendingResolve.domains[index]}
                                                    </Typography>
                                                    <IconButton
                                                        sx={{ p: '15px' }}
                                                        onClick={() => {
                                                            navigator.clipboard.writeText(toShow.pendingResolve.domains[index].replace(props.domain, ''))
                                                        }}
                                                    >
                                                        <ContentCopyIcon />
                                                    </IconButton>
                                                </Paper>
                                                <Paper
                                                    sx={{
                                                        alignItems: 'center',
                                                        display: 'flex',
                                                        p: '2px 4px',
                                                        margin: '10px 20px 10px 40px'
                                                    }}
                                                >
                                                    <Icon
                                                        sx={{
                                                            p: '10px',
                                                            color: '#555'
                                                        }}
                                                    >
                                                        <ReceiptLongIcon />
                                                    </Icon>
                                                    <Typography
                                                        sx={{
                                                            flex: 1
                                                        }}
                                                    >
                                                        记录：{toShow.pendingResolve.records[index]}
                                                    </Typography>
                                                    <IconButton
                                                        sx={{ p: '15px' }}
                                                        onClick={() => {
                                                            navigator.clipboard.writeText(toShow.pendingResolve.records[index])
                                                        }}
                                                    >
                                                        <ContentCopyIcon />
                                                    </IconButton>
                                                </Paper>
                                            </motion.span>
                                        ))
                                    }
                                </AnimatePresence>
                                <Button
                                    onClick={() => {
                                        handleExec('renew', props.domain)
                                        setToShow({
                                            code: -1
                                        })
                                    }}
                                    variant='outlined'
                                    sx={{
                                        margin: '10px 0'
                                    }}
                                >
                                    我已完成解析
                                </Button>
                            </>
                        )
                    }
                </Paper>
                <Paper
                    id='console'
                    sx={{
                        backgroundColor: '#222',
                        height: '0',
                        overflow: 'scroll',
                        padding: '0px 40px',
                        transition: 'all 0.2s'
                    }}
                    ref={consoleViewRef}
                >
                    <span className='info'>Virtual console v20220927@build 0</span>
                    <span className='info'>Data received:</span>
                </Paper>
                <Button
                    onClick={() => {
                        window.location.hash = '/'
                    }}
                    variant='outlined'
                    sx={{
                        margin: '10px 0'
                    }}
                >
                    返回
                </Button>
            </Box>
        </motion.div>
    )
}

export default DetailPage