//!native
//!optimize 2
export namespace FuzzySearch {
	interface IOptions {
		case_sensitive: boolean;
	}

	function CharAt(value: string, index: number) {
		++index;
		return value.sub(index, index);
	}

	/**levenstein distance
	 * @see https://gist.github.com/keesey/e09d0af833476385b9ee13b6d26a2b84
	 */
	function Levenstein(a: string, b: string, options?: IOptions): number {
		if (!options?.case_sensitive) {
			a = a.lower();
			b = b.lower();
		}

		const an = a ? a.size() : 0;
		const bn = b ? b.size() : 0;
		if (an === 0) {
			return bn;
		}
		if (bn === 0) {
			return an;
		}

		const matrix = new Array<number[]>(bn + 1);
		for (let i = 0; i <= bn; ++i) {
			const row = (matrix[i] = new Array<number>(an + 1));
			row[0] = i;
		}
		const first_row = matrix[0];
		for (let j = 1; j <= an; ++j) {
			first_row[j] = j;
		}
		for (let i = 1; i <= bn; ++i) {
			for (let j = 1; j <= an; ++j) {
				if (CharAt(b, i - 1) === CharAt(b, j - 1)) {
					matrix[i][j] = matrix[i - 1][j - 1];
					continue;
				}
				matrix[i][j] =
					math.min(
						matrix[i - 1][j - 1], //substitution
						matrix[i][j - 1], //insertion
						matrix[i - 1][j], //deletion
					) + 1;
			}
		}

		return matrix[bn][an];
	}

	function Jaro(string_1: string, string_2: string, options?: IOptions) {
		if (string_1.size() === 0 || string_2.size() === 0) {
			return 0;
		}

		if (!options?.case_sensitive) {
			string_1 = string_1.lower();
			string_2 = string_2.lower();
		}

		if (string_1 === string_2) return 1;

		let m = 0;
		const len1 = string_1.size();
		const len2 = string_1.size();

		const window = math.floor(math.max(len1, len2) / 2) - 1;

		const str1_hash = new Array<boolean>(len1);
		const str2_hash = new Array<boolean>(len2);

		for (let i = 0; i < len1; i++) {
			for (let j = math.max(0, i - window); j < math.min(len2, i + window + 1); j++) {
				if (
					!str1_hash[i] &&
					!str2_hash[j] &&
					CharAt(string_1, i) === CharAt(string_2, j)
				) {
					++m;
					str1_hash[i] = str2_hash[j] = true;
					break;
				}
			}
		}

		if (m === 0) return 0;

		let t = 0;
		let point = 0;
		for (let i = 0; i < len1; i++) {
			if (str1_hash[i]) {
				while (!str2_hash[point]) {
					point++;
				}

				if (CharAt(string_1, i) !== CharAt(string_2, point++)) {
					t++;
				}
			}
		}

		t /= 2;
		return (m / len1 + m / len2 + (m - t) / m) / 3;
	}

	/**@see https://github.com/kwunshing123/jaro-winkler-typescript/blob/master/src/index.ts */
	export function JaroWinkler(string_1: string, string_2: string, options?: IOptions): number {
		let jaro_dist: number = Jaro(string_1, string_2, options);
		let prefix = 0;

		if (jaro_dist > 0.7) {
			const min_index = math.min(string_1.size(), string_2.size());
			let i = 0;
			while (CharAt(string_1, i) === CharAt(string_2, i) && i < 4 && i < min_index) {
				++prefix;
				++i;
			}
			jaro_dist += 0.1 * prefix * (1 - jaro_dist);
		}

		return jaro_dist;
	}

	export function SortByJaroWinkler<T>(
		search_input: string,
		array: readonly T[],
		selector: (value: T) => string,
		sort_options?: IOptions,
		ignore_not_matching?: boolean
	): T[] {
		const array_size = array.size();
		const selected_values: [number, T][] = new Array(array_size);
		let i = 0;
		for (const value of array) {
			const jaro_winkler_result = JaroWinkler(search_input, selector(value), sort_options)
			if(ignore_not_matching && jaro_winkler_result === 0) continue;
			selected_values[i++] = [jaro_winkler_result, value];
		}
		table.sort(selected_values, ([a_value], [b_value]) => a_value > b_value);
		const sorted_array = new Array<T>(array_size);
		i = 0;
		for (const [_, value] of selected_values) {
			sorted_array[i++] = value;
		}
		return sorted_array;
	}
}
