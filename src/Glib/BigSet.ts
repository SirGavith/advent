export class BigSet<T> {
	/*
		public api, compatible with "Set"
	*/
	private sets: Set<T>[] = []
		private readonly kMaxSize = Math.pow(2, 24)


	constructor (iterable?: Iterable<T> | null | undefined) {
		this.sets = [new Set(iterable)]
	}

	add (key: T) {
		const set = this.sets[this.sets.length - 1]

		if (set.size === this.kMaxSize) {
			this.sets.push(new Set())
			this.add(key)
		} else {
			set.add(key)
		}
	}

	has (key: T) {
		return this.setForKey(key) !== undefined
	}

	delete (key: T) {
		const set = this.setForKey(key)

		if (set !== undefined) {
		return set.delete(key)
		}

		return false
	}

	clear () {
		for (let set of this.sets) {
		set.clear()
		}
	}

	get size () {
		let size = 0

		for (let set of this.sets) {
		size += set.size
		}

		return size
	}

	forEach (callbackFn: (value: T | [T, T]) => void) {
		for (let value of this) {
			callbackFn(value)
		}
	}

	entries () {
		return this.iterator('entries')
	}

	keys () {
		return this.iterator('keys')
	}

	values () {
		return this.iterator('values')
	}

	[Symbol.iterator] () {
		return this.iterator(Symbol.iterator)
	}

	private setForKey (key: T) {
		for (let index = this.sets.length - 1; index >= 0; index--) {
			const set = this.sets[index]

			if (set.has(key)) {
			return set
			}
		}
	}

	private iterator (name: 'entries' | 'keys' | 'values' | typeof Symbol.iterator) {
		const items = this.sets
		let index = 0

		var iterator = items[index][name]()

		return {
			next: () => {
				let result = iterator.next()

				if (result.done && index < (items.length - 1)) {
					index++
					iterator = items[index][name]()
					result = iterator.next()
				}

				return result
			},
			[Symbol.iterator]: function () {
				return this
			}
		}
	}
	
}
