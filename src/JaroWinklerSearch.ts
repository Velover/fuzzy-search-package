//!native
//!optimize 2
import CharAt from "./Utils/CharAt";

export namespace JaroWinklerSearch {
	function Jaro(
		string_1: string,
		string_2: string,
		case_sensitive: boolean = true,
	) {
		if (string_1.size() === 0 || string_2.size() === 0) {
			return 0;
		}

		if (!case_sensitive) {
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

		for (const i of $range(0, len1 - 1)) {
			for (const j of $range(
				math.max(0, i - window),
				math.min(len2, i + window + 1) - 1,
			)) {
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
		for (const i of $range(0, len1 - 1)) {
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
	export function JaroWinkler(
		string_1: string,
		string_2: string,
		case_sensitive: boolean = true,
	): number {
		let jaro_dist: number = Jaro(string_1, string_2, case_sensitive);
		let prefix = 0;

		if (jaro_dist > 0.7) {
			const min_index = math.min(string_1.size(), string_2.size());
			let i = 0;
			while (
				CharAt(string_1, i) === CharAt(string_2, i) &&
				i < 4 &&
				i < min_index
			) {
				++prefix;
				++i;
			}
			jaro_dist += 0.1 * prefix * (1 - jaro_dist);
		}

		return jaro_dist;
	}

	export function GetBestResultString(
		search_input: string,
		data: readonly string[],
		case_sensitive?: boolean,
	): string {
		assert(data.size() > 0, "Array is empty");
		let best_result = -1;
		let best_match = "";
		for (const value of data) {
			const jaro_result = JaroWinkler(search_input, value, case_sensitive);
			if (jaro_result > best_result) {
				best_match = value;
				best_result = jaro_result;
			}
		}
		return best_match;
	}

	/**
	 *
	 * @param search_input
	 * @param data
	 * @param case_sensitive
	 * @param min_value default 0 | [0, 1]: 0 - not relevant 1 - exact match
	 * @returns
	 */
	export function SortStrings(
		search_input: string,
		data: readonly string[],
		case_sensitive?: boolean,
		min_value: number = 0,
	) {
		const results = new Array<[number, string]>(data.size());
		let k = 0;
		for (const value of data) {
			const jaro_result = JaroWinkler(search_input, value, case_sensitive);
			if (jaro_result < min_value) continue;
			results[k++] = [jaro_result, value];
		}
		table.sort(results, ([a_value], [b_value]) => a_value > b_value);
		const sorted_data = new Array<string>(results.size());
		k = 0;
		for (const result of results) {
			sorted_data[k++] = result[1];
		}
		return sorted_data;
	}

	export function GetBestResultObject<T>(
		search_input: string,
		data: readonly T[],
		selector: (value: T) => string,
		case_sensitive?: boolean,
	): T {
		assert(data.size() > 0, "Array is empty");
		let best_result = -1;
		let best_match: T;
		for (const value of data) {
			const jaro_result = JaroWinkler(
				search_input,
				selector(value),
				case_sensitive,
			);
			if (jaro_result > best_result) {
				best_match = value;
				best_result = jaro_result;
			}
		}
		return best_match!;
	}

	/**
	 *
	 * @param search_input
	 * @param data
	 * @param min_value default 0 | [0, 1]: 0 - not relevant 1 - exact match
	 * @param selector
	 * @param case_sensitive
	 * @returns
	 */
	export function SortObjects<T>(
		search_input: string,
		data: readonly T[],
		selector: (value: T) => string,
		case_sensitive?: boolean,
		min_value: number = 0,
	) {
		const results = new Array<[number, T]>(data.size());
		let k = 0;
		for (const value of data) {
			const jaro_result = JaroWinkler(
				search_input,
				selector(value),
				case_sensitive,
			);
			if (jaro_result < min_value) continue;
			results[k++] = [jaro_result, value];
		}
		table.sort(results, ([a_value], [b_value]) => a_value > b_value);
		const sorted_data = new Array<T>(results.size());
		k = 0;
		for (const result of results) {
			sorted_data[k++] = result[1];
		}
		return sorted_data;
	}
}
