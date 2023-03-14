import { Avatar, Button, Dropdown, Input, Loading, Modal, Text } from '@nextui-org/react';
import { useRequest, useSessionStorageState } from 'ahooks';
import React, { useContext, useEffect } from 'react';
import { Hide, Show, User } from 'react-iconly';
import { getUser, userContext } from '../lib/Requests';

const Login = () => {
    const [username, setUsername] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [cached, setCached] = useSessionStorageState("currentUser")
    const [data, setData] = useContext(userContext)
    const [selectedKey, setSelectedKey] = React.useState();
    const { loading, run } = useRequest(getUser, {
        manual: true, debounceWait: 300, throttleWait: 300,
        onSuccess: (result) => {
            setData(result);
            setCached(result);
        },
        onError: (error) => {
            console.log(error);
        },
        cacheKey: 'currentUser'
    });
    const [visible, setVisible] = React.useState(false);
    const handler = () => setVisible(true);

    const closeHandler = () => {
        setVisible(false);
    };

    const clearLogin = () => {
        setCached(undefined)
        setData(undefined)
        setSelectedKey(undefined)
    }

    useEffect(() => {
        if (cached) {
            setData(cached)
            setVisible(false)
        }
        if (data) {
            setVisible(false)
        }
    }, [data]);

    useEffect(() => {
        if (!selectedKey) return;
        if (selectedKey.toLowerCase() === "logout") {
            clearLogin()
        }

    }, [selectedKey])

    return (
        <>
            {!data && <Button auto shadow onPress={handler}>Login</Button>}
            {loading ? <Loading /> :
                data && data.avatar_url ?
                    data &&
                    <Dropdown placement="bottom-left">
                        <Dropdown.Trigger>
                            <Avatar zoomed bordered text={data.name} src={data.avatar_url} />
                        </Dropdown.Trigger>
                        <Dropdown.Menu color="secondary" aria-label="Avatar Actions" onAction={setSelectedKey}>
                            <Dropdown.Item key="email" textValue={data.email.trim()} >
                                <Text color="inherit" >
                                    {data.email.trim()}
                                </Text>
                            </Dropdown.Item>
                            <Dropdown.Item key="logout" withDivider
                                color="error" textValue="Log Out"
                            >Log out
                            </Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                    : data && <Text href="#"> {data.name} </Text>}
            <Modal
                closeButton
                blur
                aria-labelledby="modal-title"
                open={visible}
                onClose={closeHandler}>
                <Modal.Header>
                    <Text id="modal-title" size={18}>
                        Please enter your Github user name and token
                    </Text>
                </Modal.Header>
                <Modal.Body>
                    <Input aria-label="Github User Name"
                        clearable
                        bordered
                        fullWidth
                        color="primary"
                        size="lg"
                        placeholder="Github User Name"
                        value={username}
                        contentRight={<User />}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                    <Input.Password aria-label="Github Token"
                        clearable
                        bordered
                        fullWidth
                        color="primary"
                        size="lg"
                        placeholder="Github Token"
                        value={password}
                        visibleIcon={<Show />}
                        hiddenIcon={<Hide />}
                        onChange={(e) => setPassword(e.target.value)}
                    />

                </Modal.Body>
                <Modal.Footer>
                    <Button auto flat color="error" onPress={closeHandler}>
                        Close
                    </Button>
                    <Button auto onPress={() => run(username, password)}>
                        {/* <Button auto onClick={closeHandler}> */}
                        Login
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}

export default Login;