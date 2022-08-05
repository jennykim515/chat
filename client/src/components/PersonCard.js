import '../style/personCard.css'
const PersonCard = (props) => {
    const name = props.name;
    const status = props.active;

    return (
        <div className={`person-card ${status ? 'active-chat' : ''}`}>
            <h5>{name}</h5>
        </div>
    )
}
export default PersonCard;