import { walletApiInstance, trackerApiInstance } from './config'
import { randomUint32, makeUrl } from 'utils/utils'

export async function getPReps() {
    const walletApi = await walletApiInstance()
    return new Promise(resolve => {
        const param = {
            jsonrpc: "2.0",
            method: "icx_call",
            id: randomUint32(),
            params: {
                "from": "hx0000000000000000000000000000000000000000",
                "to": "cx0000000000000000000000000000000000000000",
                "dataType": "call",
                "data": {
                    "method": 'getPReps',
                }
            }
        }
        walletApi.post(`/api/v3`, JSON.stringify(param))
            .then(response => {
                resolve(response.data.result);
            })
            .catch(error => {
                console.error(error)
                resolve({ preps: [] });
                // if (!!error.response) {
                //     resolve(error.response.data);
                // }
                // else {
                //     resolve({
                //         error: {
                //             message: error.message
                //         }
                //     })
                // }
            })
    });
}

export async function getIISSInfo() {
    const walletApi = await walletApiInstance()
    return new Promise(resolve => {
        const param = {
            jsonrpc: "2.0",
            method: "icx_call",
            id: randomUint32(),
            params: {
                "from": "hx0000000000000000000000000000000000000000",
                "to": "cx0000000000000000000000000000000000000000",
                "dataType": "call",
                "data": {
                    "method": 'getIISSInfo',
                }
            }
        }
        walletApi.post(`/api/v3`, JSON.stringify(param))
            .then(response => {
                resolve(response.data.result);
            })
            .catch(error => {
                if (!!error.response) {
                    resolve(error.response.data);
                }
                else {
                    resolve({
                        error: {
                            message: error.message
                        }
                    })
                }
            })
    });
}

export async function getPRep(address) {
    if (!address) return {}

    const walletApi = await walletApiInstance()
    return new Promise(resolve => {
        const param = {
            jsonrpc: "2.0",
            id: randomUint32(),
            method: "icx_call",
            params: {
                "from": "hx0000000000000000000000000000000000000000",
                "to": "cx0000000000000000000000000000000000000000",
                "dataType": "call",
                "data": {
                    "method": "getPRep",
                    "params": {
                        address
                    }
                }
            }
        }
        walletApi.post(`/api/v3`, JSON.stringify(param))
            .then(response => {
                resolve(response.data.result);
            })
            .catch(error => {
                resolve({})
                // if (!!error.response) {
                //     resolve(error.response.data);
                // }
                // else {
                //     resolve({
                //         error: {
                //             message: error.message
                //         }
                //     })
                // }
            })
    });
}

export async function getLastBlock() {
    const walletApi = await walletApiInstance()
    return new Promise(resolve => {
        const param = {
            jsonrpc: "2.0",
            method: "icx_getLastBlock",
            id: randomUint32(),
        }
        walletApi.post(`/api/v3`, JSON.stringify(param))
            .then(response => {
                resolve(response.data.result);
            })
            .catch(error => {
                if (!!error.response) {
                    resolve(error.response.data);
                }
                else {
                    resolve({
                        error: {
                            message: error.message
                        }
                    })
                }
            })
    });
}

export async function getStepPrice() {
    const walletApi = await walletApiInstance()
    return new Promise(resolve => {
        const param = {
            jsonrpc: "2.0",
            id: randomUint32(),
            "method": "icx_call",
            "params": {
                "to": "cx0000000000000000000000000000000000000001",
                "dataType": "call",
                "data": {
                    "method": "getStepPrice"
                }
            }
        }
        walletApi.post(`/api/v3`, JSON.stringify(param))
            .then(response => {
                resolve(response.data.result);
            })
            .catch(error => {
                // if (!!error.response) {
                //     resolve(error.response.data);
                // }
                // else {
                //     resolve({
                //         error: {
                //             message: error.message
                //         }
                //     })
                // }
                resolve(0x0)
            })
    });
}

export async function iissPrepRepJsonActive(payload) {
    const trackerApi = await trackerApiInstance()
    return new Promise((resolve, reject) => {
        trackerApi.get(makeUrl(`/v3/iiss/prep/repJson`, payload))
            .then(result => {
                const { data } = result.data
                resolve(data)
            })
            .catch(error => {
                console.error(error)
                resolve({})
            })
    })
}

export async function prepMain() {
    const trackerApi = await trackerApiInstance()
    return new Promise((resolve, reject) => {
        trackerApi.get(makeUrl(`/v3/iiss/prep/main`, { count: 22 }))
            .then(result => {
                const { data } = result.data
                const _data = data.map((item, index) => {
                    if (!item.rank) {
                        item.rank = index + 1
                    }
                    return item
                })
                resolve(_data)
            })
            .catch(error => {
                reject(error)
            })
    })
}

export async function prepSub() {
    const trackerApi = await trackerApiInstance()
    return new Promise((resolve, reject) => {
        trackerApi.get(makeUrl(`/v3/iiss/prep/sub`, { count: 100 }))
            .then(result => {
                const { data } = result.data
                const _data = data.map((item, index) => {
                    if (!item.rank) {
                        item.rank = index + 1
                    }
                    return item
                })
                resolve(_data)
            })
            .catch(error => {
                reject(error)
            })
    })
}

export async function prepList(grade) {
    const trackerApi = await trackerApiInstance()
    const payload = { count: 500 }
    if (grade) {
        payload.grade = grade
    }
    return new Promise((resolve, reject) => {
        trackerApi.get(makeUrl(`/v3/iiss/prep/list`, payload))
            .then(result => {
                const { data } = result.data
                const nameSorted = (data || []).sort((a, b) => a.name < b.name ? -1 : a.name > b.name ? 1 : 0)
                const delegatedSorted = nameSorted.sort((b, a) => a.delegated < b.delegated ? -1 : a.delegated > b.delegated ? 1 : 0)
                const _data = delegatedSorted.map((item, index) => ({ ...item, rank: index + 1 }))
                resolve(_data)
                // const delegated = _data.filter(item => item.delegated !== 0).map((item, index) => ({ ...item, rank: index + 1 }))
                // const undelegated = _data.filter(item => item.delegated === 0).sort((a, b) => a.grade - b.grade)
                // resolve([...delegated, ...undelegated])
            })
            .catch(error => {
                reject(error)
            })
    })
}

export async function getStake(address) {
    const walletApi = await walletApiInstance()
    return new Promise(resolve => {
        const param = {
            jsonrpc: "2.0",
            id: randomUint32(),
            method: "icx_call",
            params: {
                "from": "hx0000000000000000000000000000000000000000",
                "to": "cx0000000000000000000000000000000000000000",
                "dataType": "call",
                "data": {
                    "method": "getStake",
                    "params": {
                        address
                    }
                }
            }
        }
        walletApi.post(`/api/v3`, JSON.stringify(param))
            .then(response => {
                resolve(response.data.result);
            })
            .catch(error => {
                if (!!error.response) {
                    resolve(error.response.data);
                }
                else {
                    resolve({
                        error: {
                            message: error.message
                        }
                    })
                }
            })
    });
}

export async function queryIScore(address) {
    const walletApi = await walletApiInstance()
    return new Promise(resolve => {
        const param = {
            jsonrpc: "2.0",
            id: randomUint32(),
            method: "icx_call",
            params: {
                "from": "hx0000000000000000000000000000000000000000",
                "to": "cx0000000000000000000000000000000000000000",
                "dataType": "call",
                "data": {
                    "method": "queryIScore",
                    "params": {
                        address
                    }
                }
            }
        }
        walletApi.post(`/api/v3`, JSON.stringify(param))
            .then(response => {
                resolve(response.data.result);
            })
            .catch(error => {
                if (!!error.response) {
                    resolve(error.response.data);
                }
                else {
                    resolve({
                        error: {
                            message: error.message
                        }
                    })
                }
            })
    });
}

export async function getDelegation(address) {
    const walletApi = await walletApiInstance()
    return new Promise(resolve => {
        const param = {
            jsonrpc: "2.0",
            id: randomUint32(),
            method: "icx_call",
            params: {
                "from": "hx0000000000000000000000000000000000000000",
                "to": "cx0000000000000000000000000000000000000000",
                "dataType": "call",
                "data": {
                    "method": "getDelegation",
                    "params": {
                        address
                    }
                }
            }
        }
        walletApi.post(`/api/v3`, JSON.stringify(param))
            .then(response => {
                resolve(response.data.result);
            })
            .catch(error => {
                console.error(error)
                resolve({ delegations: [] });
                // if (!!error.response) {
                //     resolve(error.response.data);
                // }
                // else {
                //     resolve({
                //         error: {
                //             message: error.message
                //         }
                //     })
                // }
            })
    });
}

export async function getBalance(address) {
    const walletApi = await walletApiInstance()
    return new Promise(resolve => {
        const param = {
            jsonrpc: "2.0",
            id: randomUint32(),
            method: "icx_getBalance",
            params: {
                address
            }
        }
        walletApi.post(`/api/v3`, JSON.stringify(param))
            .then(response => {
                resolve(response.data.result);
            })
            .catch(error => {
                if (!!error.response) {
                    resolve(error.response.data);
                }
                else {
                    resolve({
                        error: {
                            message: error.message
                        }
                    })
                }
            })
    });
}

export async function getProposals() {
    return new Promise(async resolve => {
        // const mock = {
        //     "proposals": [
        //         {
        //             "id": "0xb903239f8543d04b5dc1ba6579132b143087c68db1b2168786408fcbce568238",
        //             "proposer": "hxbe258ceb872e08851f1f59694dac2558708ece11",
        //             "proposerName": "Icon Foundation",
        //             "status": "0x0",
        //             "startBlockHeight": "0x1",
        //             "endBlockHeight": "0x65",
        //             "vote": {
        //                 "agree": {
        //                     "count": "0x8",
        //                     "amount": "0x12312341234a"
        //                 },
        //                 "disagree": {
        //                     "count": "0x6",
        //                     "amount": "0x12312341234a"
        //                 },
        //                 "noVote": {
        //                     "count": "0x8",
        //                     "amount": "0x12312341234a"
        //                 },
        //             },
        //             "contents": {
        //                 "title": "Disqualify P-Rep A",
        //                 "description": "P-Rep A does not maintain node",
        //                 "type": "0x1",
        //                 "value": {
        //                     "address": "hxbe258ceb872e08851f1f59694dac2558708ece11"
        //                 }
        //             }
        //         }
        //     ]
        // }
        // resolve(mock)
        const walletApi = await walletApiInstance()
        walletApi.post(`/api/v3`, JSON.stringify({
            jsonrpc: "2.0",
            id: randomUint32(),
            method: "icx_call",
            params: {
                "from": "hx0000000000000000000000000000000000000000",
                "to": "cx0000000000000000000000000000000000000001",
                "dataType": "call",
                "data": {
                    "method": "getProposals",
                }
            }
        }))
            .then(response => {
                resolve(response.data.result);
            })
            .catch(error => {
                console.error(error)
                resolve({ proposals: [] });
            })
    });
}

export async function getProposal(id) {
    return new Promise(async resolve => {
        // const mock = {
        //     "id": id,
        //     "proposer": "hxbe258ceb872e08851f1f59694dac2558708ece11",
        //     "proposerName": "Icon Foundation",
        //     "status": "0x0",
        //     "startBlockHeight": "0x1",
        //     "endBlockHeight": "0x65",
        //     "vote": {
        //         "agree": {
        //             "list": [{
        //                 "id": "0xb903239f8543d04b5dc1ba6579132b143087c68db1b2168786408fcbce568238",
        //                 "timestamp": "0x563a6cf330133",
        //                 "address": "hxe7af5fcfd8dfc67530a01a0e403882687528dfcb",
        //                 "name": "Icon Foundation",
        //                 "amount": "0x1"
        //             },{
        //                 "id": "0xb903239f8543d04b5dc1ba6579132b143087c68db1b2168786408fcbce568238",
        //                 "timestamp": "0x563a6cf330135",
        //                 "address": "hxe7af5fcfd8dfc67530a01a0e403882687528dfcb",
        //                 "name": "Icon Foundation",
        //                 "amount": "0x1"
        //             },{
        //                 "id": "0xb903239f8543d04b5dc1ba6579132b143087c68db1b2168786408fcbce568238",
        //                 "timestamp": "0x563adcf330134",
        //                 "address": "hxe7af5fcfd8dfc67530a01a0e403882687528dfcb",
        //                 "name": "Icon Foundation",
        //                 "amount": "0x1"
        //             },{
        //                 "id": "0xb903239f8543d04b5dc1ba6579132b143087c68db1b2168786408fcbce568238",
        //                 "timestamp": "0x563a6cf330133",
        //                 "address": "hxe7af5fcfd8dfc67530a01a0e403882687528dfcb",
        //                 "name": "Icon Foundation",
        //                 "amount": "0x1"
        //             },{
        //                 "id": "0xb903239f8543d04b5dc1ba6579132b143087c68db1b2168786408fcbce568238",
        //                 "timestamp": "0x563a6cf330132",
        //                 "address": "hxe7af5fcfd8dfc67530a01a0e403882687528dfcb",
        //                 "name": "Icon Foundation",
        //                 "amount": "0x1"
        //             },{
        //                 "id": "0xb903239f8543d04b5dc1ba6579132b143087c68db1b2168786408fcbce568238",
        //                 "timestamp": "0x563a6cf330131",
        //                 "address": "hxe7af5fcfd8dfc67530a01a0e403882687528dfcb",
        //                 "name": "Icon Foundation",
        //                 "amount": "0x1"
        //             }],
        //             "amount": "0x12345"
        //         },
        //         "disagree": {
        //             "list": [{
        //                 "id": "0xb903239f8543d04b5dc1ba6579132b143087c68db1b2168786408fcbce568238",
        //                 "timestamp": "0x563a6cf330136",
        //                 "address": "hxe7af5fcfd8dfc67530a01a0e403882687528dfcb",
        //                 "name": "Icon Foundation",
        //                 "amount": "0x1"
        //             },{
        //                 "id": "0xb903239f8543d04b5dc1ba6579132b143087c68db1b2168786408fcbce568238",
        //                 "timestamp": "0x563a6cf330136",
        //                 "address": "hxe7af5fcfd8dfc67530a01a0e403882687528dfcb",
        //                 "name": "Icon Foundation",
        //                 "amount": "0x1"
        //             },{
        //                 "id": "0xb903239f8543d04b5dc1ba6579132b143087c68db1b2168786408fcbce568238",
        //                 "timestamp": "0x563a6cf330136",
        //                 "address": "hxe7af5fcfd8dfc67530a01a0e403882687528dfcb",
        //                 "name": "Icon Foundation",
        //                 "amount": "0x1"
        //             },{
        //                 "id": "0xb903239f8543d04b5dc1ba6579132b143087c68db1b2168786408fcbce568238",
        //                 "timestamp": "0x563a6cf330136",
        //                 "address": "hxe7af5fcfd8dfc67530a01a0e403882687528dfcb",
        //                 "name": "Icon Foundation",
        //                 "amount": "0x1"
        //             }],
        //             "amount": "0x22346"
        //         },
        //         "noVote": {
        //             "list": ["hx31258ceb872e08851f1f59694dac2558708ece11", "hx31258ceb872e08851f1f59694dac2558708eceff"],
        //             "amount": "0x12312341234a"
        //         },
        //     },
        //     "contents": {
        //         "title": "Disqualify P-Rep A",
        //         "description": "P-Rep A does not maintain node",
        //         "type": "0x1",
        //         "value": {
        //             "address": "hxbe258ceb872e08851f1f59694dac2558708ece11"
        //         }
        //     }
        // }
        // resolve(mock)
        const walletApi = await walletApiInstance()
        walletApi.post(`/api/v3`, JSON.stringify({
            jsonrpc: "2.0",
            id: randomUint32(),
            method: "icx_call",
            params: {
                "from": "hx0000000000000000000000000000000000000000",
                "to": "cx0000000000000000000000000000000000000001",
                "dataType": "call",
                "data": {
                    "method": "getProposal",
                    "params": {
                        "id": id
                    }
                }
            }
        }))
            .then(response => {
                resolve(response.data.result);
            })
            .catch(error => {
                console.error(error)
                resolve({});
            })
    });
}

export async function addressReward(payload) {
    const trackerApi = await trackerApiInstance()
    return new Promise((resolve, reject) => {
        trackerApi.get(makeUrl(`/v3/address/claimIScoreList`, payload))
            .then(result => {
                resolve(result.data)
            })
            .catch(error => {
                reject(error)
            })
    })
}