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

## 1.0.0 - 2021-09-17

### Added

- API: Add support for claimClaimableBalance operation.

### Changed

- Meta: Update dependencies.
- Meta: Upgrade stellar-sdk to 8.x.

## 1.0.0-beta.7 - 2020-09-12

### Changed

- Data: Update @cosmic-plus/base to 2.8.1.

## 1.0.0-beta.6 - 2020-07-12

### Fixed

- Logic: Fix sequence number checks.

## 1.0.0-beta.5 - 2020-06-21

### Added

- API: `new TxParams()` accepts query & StellarSdk formatted values. For
  example, an `asset` field will either accepts `"code:issuer"` or `{ code, issuer }`.
- Logic: Add partial support for asynchrous format conversion.
- Meta: Add polyfilling.

### Changed

- Logic: Move some logic from parse() to normalize().

## 1.0.0-beta.4 - 2020-06-14

### Changed

- Meta: Switch to @cosmic-plus/helpers, @cosmic-plus/utils.

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
