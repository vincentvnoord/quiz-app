import useGameStore from "../game-store"


export const CloseLobbyButton = () => {
    const { connection, gameCode } = useGameStore();

    const closeLobby = async () => {
        await connection?.invoke("CloseGame", gameCode);
    }

    return (
        <button onClick={closeLobby} className="p-3 h-fit hover:bg-black/20 rounded-lg transition-colors duartion-100 ease-in opacity-50">Close lobby</button>
    )
}