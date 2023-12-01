interface Boolean {
    IsTrue(action: () => void): void
    IsFalse(action: () => void): void
    Log(): boolean
}
Boolean.prototype.IsTrue = function(action: () => void) {
    if (this) action()
}
Boolean.prototype.IsFalse = function(action: () => void) {
    if (!this) action()
}
Boolean.prototype.Log = function() {
    console.log(this)
    return this.valueOf()
}