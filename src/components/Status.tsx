import React from "react";
import { selectHasJoined, selectIsConnected, selectNickname, selectRoomId } from "../store/appSlice/appSelectors";
import { useSelector } from "react-redux";
import "./Status.css";

interface StatusProps {
    isJoining?: boolean;
}

const Status: React.FC<StatusProps> = ({ isJoining = false }) => {
    const isConnected = useSelector(selectIsConnected);
    const hasJoined = useSelector(selectHasJoined);
    const nickname = useSelector(selectNickname);
    const roomId = useSelector(selectRoomId);

    if (isConnected && isJoining && !hasJoined && nickname && roomId) {
        return (
            <div className="joining-status" role="status" aria-live="polite">
                Joining room {roomId}... Please wait.
            </div>
        );
    }

    if (isConnected) return null;

    return (
        <div className="connection-status" role="status" aria-live="polite">
            Connecting to server... Please wait.
        </div>
    );
}

export default Status;