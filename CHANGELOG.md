**tx-params /**
[Readme](https://cosmic.plus/#view:js-tx-params)
• [Contributing](https://cosmic.plus/#view:js-tx-params/CONTRIBUTING)
• [Changelog](https://cosmic.plus/#view:js-tx-params/CHANGELOG)

# Changelog

All notable changes to this project will be documented in this file.

This project adheres to **[Semantic
Versioning](https://semver.org/spec/v2.0.0.html)**. Version syntax is
`{major}.{minor}.{patch}`, where a field bump means:

- **Patch**: The release contains bug fixes.
- **Minor**: The release contains backward-compatible changes.
- **Major**: The release contains compatibility-breaking changes.

**Remember:** Both micro and minor releases are guaranteed to respect
backward-compatibility and can be updated to without risk of breakage. For major
releases, please check this changelog before upgrading.

## 1.0.0-beta.3 - 2020-06-07

### Fixed

- Logic: Fix handling of single-sourced operation (query format).
- Logic: Fix support for multiple operations (query format).
- Logic: Fix number decoding (transaction format).
- Logic: Fix signers decoding (transaction format).
- Logic: Fix handling of `changeTrust` op (transaction format).

## 1.0.0-beta.2 - 2020-05-31

### Added

- Logic: Add support for the new `authorize` flag (protocol v13).

### Changed

- Logic: Switch to Stellar protocol 13.

### Fixed

- Logic: Fix `manageData` operation conversion.
- Logic: Fix StellarSdk Transaction timeBounds decoding.

## 1.0.0-beta.1 - 2020-05-11

Initial release.
