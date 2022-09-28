import {
    Box,
    Button,
    CircularProgress,
    Paper,
    Typography,
    Icon,
    IconButton
} from '@mui/material'
import React from 'react'
import Convert from 'ansi-to-html'
import {
    motion,
    AnimatePresence
} from 'framer-motion'
import DnsIcon from '@mui/icons-material/Dns'
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong'
import ContentCopyIcon from '@mui/icons-material/ContentCopy'

import './IssuePage.css'

const convert = new Convert()

const IssuePage = (props) => {
    const ws = props.ws
    const normalViewRef = React.useRef()
    const consoleViewRef = React.useRef()
    const pendingResolve = React.useRef({
        domains: [],
        records: []
    })

    const [currentView, setCurrentView] = React.useState(0)

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
                width: '67vw',
                minWidth: '600px',
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
                    sx={{
                        backgroundColor: '#eee',
                        height: '100%',
                        overflow: 'scroll',
                        padding: '30px 40px',
                        transition: 'all 0.2s'
                    }}
                    ref={normalViewRef}
                >
                    <AnimatePresence mode='wait'>
                        {
                            toShow.code === -1 && (
                                <motion.div
                                    key='await'
                                    initial={{
                                        opacity: 0,
                                        y: 50
                                    }}
                                    animate={{
                                        opacity: 1,
                                        y: 0
                                    }}
                                    exit={{
                                        opacity: 0,
                                        y: 20
                                    }}
                                >
                                    <Box
                                        sx={{
                                            textAlign: 'center'
                                        }}
                                    >
                                        <CircularProgress sx={{
                                            margin: '10px 0 20px 0'
                                        }} />
                                        <Typography>
                                            等待执行结果
                                        </Typography>
                                    </Box>
                                </motion.div>
                            )
                        }
                        {
                            toShow.code === 1 && (
                                <motion.div
                                    key='code-1'
                                    initial={{
                                        opacity: 0,
                                        y: 50
                                    }}
                                    animate={{
                                        opacity: 1,
                                        y: 0
                                    }}
                                    exit={{
                                        opacity: 0,
                                        y: 20
                                    }}
                                >
                                    <Box
                                        sx={{
                                            textAlign: 'center'
                                        }}
                                    >
                                        <Typography
                                            variant='h4'
                                        >
                                            验证失败，请稍后重试
                                        </Typography>
                                        <Button
                                            onClick={() => {
                                                consoleViewRef.current.style.height = '100%'
                                                consoleViewRef.current.style.padding = '30px 40px'
                                                normalViewRef.current.style.height = '0px'
                                                normalViewRef.current.style.padding = '0 40px'
                                                setCurrentView(1)
                                            }}
                                            sx={{
                                                margin: '10px'
                                            }}
                                        >
                                            控制台输出
                                        </Button>
                                    </Box>
                                </motion.div>
                            )
                        }
                        {
                            toShow.code === 2 && (
                                <motion.div
                                    key='code-2'
                                    initial={{
                                        opacity: 0,
                                        y: 50
                                    }}
                                    animate={{
                                        opacity: 1,
                                        y: 0
                                    }}
                                    exit={{
                                        opacity: 0,
                                        y: 20
                                    }}
                                >
                                    <Box
                                        sx={{
                                            textAlign: 'center'
                                        }}
                                    >
                                        <Typography
                                            variant='h4'
                                        >
                                            原有证书仍在有效期内
                                        </Typography>
                                    </Box>
                                </motion.div>
                            )
                        }
                        {
                            toShow.code === 3 && (
                                <motion.div
                                    key='code-3'
                                    initial={{
                                        opacity: 0,
                                        y: 50
                                    }}
                                    animate={{
                                        opacity: 1,
                                        y: 0
                                    }}
                                    exit={{
                                        opacity: 0,
                                        y: 20
                                    }}
                                >
                                    <Typography
                                        variant='h4'
                                    >
                                        请设置TXT记录：
                                    </Typography>
                                    {
                                        toShow.pendingResolve.domains?.map((value, index) => (
                                            <motion.div
                                                key={index}
                                                initial={{
                                                    opacity: 0,
                                                    y: 50
                                                }}
                                                animate={{
                                                    opacity: 1,
                                                    y: 0
                                                }}
                                                exit={{
                                                    opacity: 0,
                                                    y: 50
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
                                            </motion.div>
                                        ))
                                    }
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
                                </motion.div>
                            )
                        }
                    </AnimatePresence>
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
                <Box
                    sx={{
                        display: 'flex'
                    }}
                >
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
                    <Box 
                        sx={{
                            flex: 1
                        }}
                    />
                    <Button
                        sx={{
                            margin: '10px 0'
                        }}
                        onClick={() => {
                            if (normalViewRef.current.style.height === '0px') {
                                consoleViewRef.current.style.height = '0px'
                                consoleViewRef.current.style.padding = '0 40px'
                                normalViewRef.current.style.height = '100%'
                                normalViewRef.current.style.padding = '30px 40px'
                                setCurrentView(0)
                            } else {
                                consoleViewRef.current.style.height = '100%'
                                consoleViewRef.current.style.padding = '30px 40px'
                                normalViewRef.current.style.height = '0px'
                                normalViewRef.current.style.padding = '0 40px'
                                setCurrentView(1)
                            }
                        }}
                    >
                        { currentView ? '切换回主界面' : '切换到控制台' }
                    </Button>
                </Box>
            </Box>
        </motion.div>
    )
}

export default IssuePage