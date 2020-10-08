export default (): boolean => {
    try {
      return !!window.sessionStorage
    } catch (e) {
      return false
    }
  }