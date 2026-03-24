type Debounced<T extends (...args: any[]) => void> = ((
	...args: Parameters<T>
) => void) & {
	cancel: () => void
}

export function debounce<T extends (...args: any[]) => void>(
	fn: T,
	delay = 300
): Debounced<T> {
	let timer: ReturnType<typeof setTimeout> | null = null

	const debounced = ((...args: Parameters<T>) => {
		if (timer) {
			clearTimeout(timer)
		}

		timer = setTimeout(() => {
			fn(...args)
		}, delay)
	}) as Debounced<T>

	debounced.cancel = () => {
		if (timer) {
			clearTimeout(timer)
			timer = null
		}
	}

	return debounced
}