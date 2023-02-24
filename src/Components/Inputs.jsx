import React, {useContext, useEffect, useState} from 'react'
import { ExperienceContext } from '../Contexts/ExperienceContext';

import { Box, Flex, Text, Input, Divider } from "@chakra-ui/core";
import { addStyles, EditableMathField } from "react-mathquill";
addStyles();

function Inputs() {
    const experience = useContext(ExperienceContext);   
    const [latexA, setLatexA] = useState("");
    const [latexB, setLatexB] = useState("");
    const [lowerBound, setLowerBound] = useState(0);
    const [upperBound, setUpperBound] = useState(3);
    const [cylinders, setCylinders] = useState(5);

    const [isHovered, setIsHovered] = useState(false);

    const [volume, setVolume] = useState(null);

    function visualize() {
        experience.experience.world.visualize(latexA, latexB, lowerBound, upperBound, cylinders);
        setVolume(experience.experience.world.getVolume())
    }

    function handleLB(event) {
        setLowerBound(event.target.value)
    }

    function handleUB(event) {
        setUpperBound(event.target.value)
    }

    function handleC(event) {
        setCylinders(event.target.value)
    }

    return (
        <Box
            position={"fixed"}
            zIndex={1}
            alignSelf={"center"}
            bg="#343a40"
            mb="3%"
            color="white"
            opacity={isHovered ? 0.8 : 0.4}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            style={{
                transition: 'opacity 0.3s ease-in-out',
            }}
            border="2px solid white"
            borderRadius={"6px"}

            display="flex"
            flexDirection={"row"}
            padding="15px"
        >
            <Flex flexDirection={"column"}>
                <Text marginTop="0px">Functions:</Text>
                <EditableMathField style={{border: '1px solid white', fontSize:"16px", borderRadius:"5px", height:"30px", width:"160px", padding:"5px", paddingLeft:"10px"}}  latex={latexA} onChange={(mathField) => {
                    setLatexA(mathField.latex());
                }}/>
                <EditableMathField style={{border: '1px solid white', fontSize:"16px", borderRadius:"5px", height:"30px", width:"160px", marginTop: "10px", padding:"5px", paddingLeft:"10px"}}  latex={latexB} onChange={(mathField) => {
                    setLatexB(mathField.latex());
                }}/>
            </Flex>
            
            <Flex marginLeft="10px" flexDirection={"column"} marginRight="10px">
                <Text marginTop="0px">Bounds:</Text>
                <Flex>
                    <Input width="20px" value={lowerBound} onChange={handleLB} height="30px" border="1px solid white" borderColor={"white"} color="white" borderRadius={"3px"} bg="transparent" placeholder='Lower' fontSize="15px" marginRight="3px"/>
                    <Input width="20px" value={upperBound} onChange={handleUB} height="30px" border="1px solid white" borderColor={"white"} color="white" borderRadius={"3px"} bg="transparent" placeholder='Upper' fontSize="15px"/>
                </Flex>
            </Flex>
            <Flex marginLeft="10px" flexDirection={"column"}>
                <Text marginTop="0px">Num of Disks:</Text>
                <Flex>
                    <Input width="20px" value={cylinders} onChange={handleC} height="30px" border="1px solid white" borderColor={"white"} color="white" borderRadius={"3px"} bg="transparent" fontSize="15px" marginRight="3px"/>
                </Flex>
            </Flex>
            <Flex marginLeft="10px" flexDirection={"column"} padding="10px">
                <button style={{width:"180px", height:"30px", backgroundColor:"teal", border: "1px solid white", borderRadius:"6px", cursor:"pointer", color:"white", fontSize:"14px"}} onClick={visualize}>Visualize</button>
                <Text paddingTop={"20px"} borderTop="1px solid white">Volume: {volume}</Text>
            </Flex>
        </Box>
    )
}

export default Inputs;
