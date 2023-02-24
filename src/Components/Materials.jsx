import React, { useContext } from "react";
import { Flex } from "@chakra-ui/core";
import { ExperienceContext } from '../Contexts/ExperienceContext';
import { useEffect } from "react";

export default function Materials() {
    const experience = useContext(ExperienceContext);

    function toggleMat0() {
        if (experience.experience) {
            experience.experience.world.toggleMat(0);
        }
    }

    function toggleMat1() {
        if (experience.experience) {
            experience.experience.world.toggleMat(1);
        }
    }
    function toggleMat2() {
        if (experience.experience) {
            experience.experience.world.toggleMat(2);
        }
    }
    return (
    <Flex
        position={"fixed"}
        zIndex={1}
        alignSelf={"flex-end"}
        flexDirection={"column"}
        marginBottom={"2%"}
        marginRight={"1%"}
    ><button onClick={toggleMat0} style={{width:"150px", height:"30px", backgroundColor:"#606c38", border: "1px solid #343a40", borderRadius:"6px", cursor:"pointer", color:"white", fontSize:"14px", marginBottom:"5%"}}>Solid</button>
        <button onClick={toggleMat1}style={{width:"150px", height:"30px", backgroundColor:"#3d405b", border: "1px solid #343a40", borderRadius:"6px", cursor:"pointer", color:"white", fontSize:"14px", marginBottom:"5%"}}>Wireframe</button>
        <button onClick={toggleMat2} style={{width:"150px", height:"30px", backgroundColor:"#560bad", border: "1px solid #343a40", borderRadius:"6px", cursor:"pointer", color:"white", fontSize:"14px", marginBottom:"5%"}}>Wireframe Anim</button>
    </Flex>
    )
}

