class Uid{
    static uniqueId() {
		const userId = `id-${Math.random().toString(36).substr(2, 16)}`;
		return userId;
	}
}
export default Uid;