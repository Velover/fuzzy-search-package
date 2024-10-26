Fuzzy search allows you to find the results even with spelling mistakes or approximate search words

**[Roblox Test Place](<https://www.roblox.com/games/118296535262249/FuzzySearch-Test-Place>)**

# Searches
- FuzzySearch.JaroWinkler

... more prob will be added in the future

## JaroWinkler

### JaroWinkler
evaluates how relevant is the string to the search keywords
```ts
const search_keywords = "app";
const string_value = "apple";
const case_sensitive = false; //@default true;

const value: number = FuzzySearch.JaroWinkler.JaroWinkler(
  search_keywords,
  string_value,
  case_sensitive
)
```

### SortStrings
sorts the array of strings by the value from JaroWinkler

@min_value - [0, 1]: 0 - not relevant, 1 - exact match

if bigger than 0, will filter out values with the score less than min_value
```ts
const search_keywords = "pnapp";
const data = ["apple", "banana", "Apple", "pinapple", "Git hub search bar"];
const min_value = 0.05; //@default 0
const case_sensitive = true; //@default true
const results: string[] = FuzzySearch.JaroWinkler.SortStrings(
  search_keywords,
  data,
  case_sensitive,
  min_value
 )
//{
//   [1] = "pinapple",
//   [2] = "Apple",
//   [3] = "apple",
//   [4] = "banana"
// }
```

### SortObjects
sorts the array of objects by the value from JaroWinkler

@min_value - [0, 1]: 0 - not relevant, 1 - exact match

if bigger than 0, will filter out values with the score less than min_value
```ts
const search_keywords = "pnapp";
interface IObject {
	Name: string;
}
const data: IObject[] = [
	{ Name: "apple" },
	{ Name: "banana" },
	{ Name: "Apple" },
	{ Name: "pinapple" },
	{ Name: "Git hub search bar" },
];
const min_value = 0.05; //@default 0
const NameSelector = (value: IObject) => value.Name;
const case_sensitive = true; //@default true
const results: IObject[] = FuzzySearch.JaroWinkler.SortObjects(
	search_keywords,
	data,
	NameSelector,
	case_sensitive,
	min_value,
);
print(results);
//{
//   [1] = {Name: "pinapple"},
//   [2] = {Name: "Apple"},
//   [3] = {Name: "apple"},
//   [4] = {Name: "banana"}
// }
```

### GetBestResultObject
finds the best match for search keywords for objects
```ts
const search_keywords = "pnapp";

interface IObject {
	Name: string;
}
const data = [
	{ Name: "apple" },
	{ Name: "banana" },
	{ Name: "Apple" },
	{ Name: "pinapple" },
	{ Name: "Git hub search bar" },
];
const NameSelector = (value: IObject) => value.Name;
const case_sensitive = true; //@default true
const result: IObject = FuzzySearch.JaroWinkler.GetBestResultObject(
	search_keywords,
	data,
	NameSelector,
	case_sensitive,
);
print(result);

//{Name: "pinapple"},
```

### GetBestResultString
finds the best match for search keywords for strings
```ts
const search_keywords = "pnapp";
const data = ["apple", "banana", "Apple", "pinapple", "Git hub search bar"];
const case_sensitive = true; //@default true
const result: string = FuzzySearch.JaroWinkler.GetBestResultString(
	search_keywords,
	data,
	case_sensitive,
);
print(result);

//"pinapple",
```
