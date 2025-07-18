# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [12.0.2]

### Changed

- Bump `@metamask/eth-sig-util` from `^8.0.0` to `^8.2.0` ([#5301](https://github.com/MetaMask/core/pull/5301))
- Bump `@metamask/utils` from `^11.1.0` to `^11.4.2` ([#5301](https://github.com/MetaMask/core/pull/5301), [#6054](https://github.com/MetaMask/core/pull/6054))
- Bump `@metamask/base-controller` from ^8.0.0 to ^8.0.1 ([#5722](https://github.com/MetaMask/core/pull/5722))
- Bump `@metamask/controller-utils` to `^11.11.0` ([#5439](https://github.com/MetaMask/core/pull/5439), [#5935](https://github.com/MetaMask/core/pull/5935), [#5583](https://github.com/MetaMask/core/pull/5583), [#5765](https://github.com/MetaMask/core/pull/5765), [#5812](https://github.com/MetaMask/core/pull/5812), [#6069](https://github.com/MetaMask/core/pull/6069))
  - This upgrade includes performance improvements to checksum hex address normalization

## [12.0.1]

### Changed

- Bump `@metamask/base-controller` from `^7.1.0` to `^8.0.0` ([#5135](https://github.com/MetaMask/core/pull/5135)), ([#5305](https://github.com/MetaMask/core/pull/5305))
- Bump `@metamask/controller-utils` from `^11.4.4` to `^11.5.0` ([#5135](https://github.com/MetaMask/core/pull/5135)), ([#5272](https://github.com/MetaMask/core/pull/5272))
- Bump `@metamask/utils` from `^11.0.1` to `^11.1.0` ([#5223](https://github.com/MetaMask/core/pull/5223))

## [12.0.0]

### Changed

- **BREAKING:** Base class of `DecryptMessageManager` and `EncryptionPublicKeyManager`(`AbstractMessageManager`) now expects new options to initialise ([#5103](https://github.com/MetaMask/core/pull/5103))
- Bump `@metamask/base-controller` from `^7.0.0` to `^7.1.0` ([#5079](https://github.com/MetaMask/core/pull/5079))

### Removed

- **BREAKING:** Removed internal event emitter (`hub` property) from `AbstractMessageManager` ([#5103](https://github.com/MetaMask/core/pull/5103))
- **BREAKING:** `unapprovedMessage` and `updateBadge` removed from internal events. These events are now emitted from messaging system ([#5103](https://github.com/MetaMask/core/pull/5103))
  - Controllers should now listen to `DerivedManagerName:X` event instead of using internal event emitter.

## [11.0.3]

### Changed

- Bump `jsonschema` from `^1.2.4` to `^1.4.1` ([#4998](https://github.com/MetaMask/core/pull/4998), [#5027](https://github.com/MetaMask/core/pull/5027))

## [11.0.2]

### Changed

- Bump `@metamask/controller-utils` from `^11.4.2` to `^11.4.4` ([#4915](https://github.com/MetaMask/core/pull/4915), [#5012](https://github.com/MetaMask/core/pull/5012))

## [11.0.1]

### Changed

- Bump `@metamask/base-controller` from `^7.0.1` to `^7.0.2` ([#4862](https://github.com/MetaMask/core/pull/4862))
- Bump `@metamask/controller-utils` from `^11.3.0` to `^11.4.2` ([#4834](https://github.com/MetaMask/core/pull/4834), [#4862](https://github.com/MetaMask/core/pull/4862), [#4870](https://github.com/MetaMask/core/pull/4870))
- Bump `@metamask/utils` from `^9.1.0` to `^10.0.0` ([#4831](https://github.com/MetaMask/core/pull/4831))
- Bump `@metamask/eth-sig-util` from `^7.0.1` to `^8.0.0` ([#4830](https://github.com/MetaMask/core/pull/4830))

## [11.0.0]

### Removed

- Remove all code related to `@metamask/signature-controller` ([#4785](https://github.com/MetaMask/core/pull/4785))
  - Remove `TypedMessageManager`.
  - Remove `PersonalMessageManager`.
  - Remove utils:
    - `validateSignMessageData`
    - `validateTypedSignMessageDataV1`
    - `validateTypedSignMessageDataV3V4`

## [10.1.1]

### Fixed

- Produce and export ESM-compatible TypeScript type declaration files in addition to CommonJS-compatible declaration files ([#4648](https://github.com/MetaMask/core/pull/4648))
  - Previously, this package shipped with only one variant of type declaration
    files, and these files were only CommonJS-compatible, and the `exports`
    field in `package.json` linked to these files. This is an anti-pattern and
    was rightfully flagged by the
    ["Are the Types Wrong?"](https://arethetypeswrong.github.io/) tool as
    ["masquerading as CJS"](https://github.com/arethetypeswrong/arethetypeswrong.github.io/blob/main/docs/problems/FalseCJS.md).
    All of the ATTW checks now pass.
- Remove chunk files ([#4648](https://github.com/MetaMask/core/pull/4648)).
  - Previously, the build tool we used to generate JavaScript files extracted
    common code to "chunk" files. While this was intended to make this package
    more tree-shakeable, it also made debugging more difficult for our
    development teams. These chunk files are no longer present.

## [10.1.0]

### Added

- Add protected methods `addRequestToMessageParams`, `createUnapprovedMessage` to `AbstractMessageManager`

### Changed

- Add `requestId` property to the `messageParams` object to reference metric event fragments created from the `createRPCMethodTrackingMiddleware` in the client ([#4636](https://github.com/MetaMask/core/pull/4636))
  - Add optional property `requestId` to `AbstractMessageParams` type
  - Add optional property `id` to `OriginalRequest` type
- Bump `@metamask/controller-utils` from `^11.1.0` to `^11.2.0` ([#4651](https://github.com/MetaMask/core/pull/4651))

## [10.0.3]

### Changed

- Bump `@metamask/base-controller` from `^6.0.2` to `^7.0.0` ([#4625](https://github.com/MetaMask/core/pull/4625), [#4643](https://github.com/MetaMask/core/pull/4643))
- Bump `typescript` from `~5.0.4` to `~5.2.2` ([#4576](https://github.com/MetaMask/core/pull/4576), [#4584](https://github.com/MetaMask/core/pull/4584))

## [10.0.2]

### Changed

- Upgrade TypeScript version to `~5.0.4` and set `moduleResolution` option to `Node16` ([#3645](https://github.com/MetaMask/core/pull/3645))
- Bump `@metamask/base-controller` from `^6.0.1` to `^6.0.2` ([#4544](https://github.com/MetaMask/core/pull/4544))
- Bump `@metamask/controller-utils` from `^11.0.1` to `^11.0.2` ([#4544](https://github.com/MetaMask/core/pull/4544))
- Bump `@metamask/utils` from `^9.0.0` to `^9.1.0` ([#4529](https://github.com/MetaMask/core/pull/4529))

## [10.0.1]

### Changed

- Bump `@metamask/utils` to `^9.0.0`, `@metamask/rpc-errors` to `^6.3.1` ([#4516](https://github.com/MetaMask/core/pull/4516))

### Fixed

- Add `EventEmitter` type annotation to the `hub` class field of `AbstractMessageManager` ([#4510](https://github.com/MetaMask/core/pull/4510))
  - This ensures that `hub` is not inferred to be a generic type, which would break types for downstream consumers.

## [10.0.0]

### Changed

- **BREAKING:** Bump minimum Node version to 18.18 ([#3611](https://github.com/MetaMask/core/pull/3611))
- Bump `@metamask/base-controller` to `^6.0.0` ([#4352](https://github.com/MetaMask/core/pull/4352))
- Bump `@metamask/controller-utils` to `^11.0.0` ([#4352](https://github.com/MetaMask/core/pull/4352))

## [9.0.0]

### Changed

- Bump `@metamask/controller-utils` to `^10.0.0` ([#4342](https://github.com/MetaMask/core/pull/4342))

### Removed

- **BREAKING:** Remove `Message`, `MessageParams`, `MessageParamsMetamask`, and `MessageManager` ([#4319](https://github.com/MetaMask/core/pull/4319))
  - Support for `eth_sign` is being removed, so these are no longer needed.

## [8.0.2]

### Changed

- Bump TypeScript version to `~4.9.5` ([#4084](https://github.com/MetaMask/core/pull/4084))
- Bump `@metamask/base-controller` to `^5.0.2` ([#4232](https://github.com/MetaMask/core/pull/4232))
- Bump `@metamask/controller-utils` to `^9.1.0` ([#4153](https://github.com/MetaMask/core/pull/4153), [#4065](https://github.com/MetaMask/core/pull/4065))

## [8.0.1]

### Fixed

- Fix `types` field in `package.json` ([#4047](https://github.com/MetaMask/core/pull/4047))

## [8.0.0]

### Added

- **BREAKING**: Add ESM build ([#3998](https://github.com/MetaMask/core/pull/3998))
  - It's no longer possible to import files from `./dist` directly.

### Changed

- **BREAKING:** Bump `@metamask/base-controller` to `^5.0.0` ([#4039](https://github.com/MetaMask/core/pull/4039))
  - This version has a number of breaking changes. See the changelog for more.
- Bump `@metamask/controller-utils` to `^9.0.0` ([#4039](https://github.com/MetaMask/core/pull/4039))

## [7.3.9]

### Changed

- Remove dependency `ethereumjs-util` ([#3943](https://github.com/MetaMask/core/pull/3943))
- Bump `@metamask/controller-utils` to `^8.0.4` ([#4007](https://github.com/MetaMask/core/pull/4007))

## [7.3.8]

### Changed

- Bump `@metamask/utils` to `^8.3.0` ([#3769](https://github.com/MetaMask/core/pull/3769))
- Bump `@metamask/base-controller` to `^4.1.1` ([#3760](https://github.com/MetaMask/core/pull/3760), [#3821](https://github.com/MetaMask/core/pull/3821))
- Bump `@metamask/controller-utils` to `^8.0.2` ([#3821](https://github.com/MetaMask/core/pull/3821))

## [7.3.7]

### Changed

- Bump `@metamask/base-controller` to `^4.0.1` ([#3695](https://github.com/MetaMask/core/pull/3695))
- Bump `@metamask/controller-utils` to `^8.0.1` ([#3695](https://github.com/MetaMask/core/pull/3695), [#3678](https://github.com/MetaMask/core/pull/3678), [#3667](https://github.com/MetaMask/core/pull/3667), [#3580](https://github.com/MetaMask/core/pull/3580))
- Bump `@metamask/eth-sig-util` to `^7.0.1` ([#3614](https://github.com/MetaMask/core/pull/3614))

## [7.3.6]

### Changed

- Bump `@metamask/utils` to ^8.2.0 ([#1957](https://github.com/MetaMask/core/pull/1957))
- Bump `@metamask/base-controller` to ^4.0.0 ([#2063](https://github.com/MetaMask/core/pull/2063))
  - This is not breaking because the message managers still inherit from BaseController v1.
- Bump `@metamask/controller-utils` to ^6.0.0 ([#2063](https://github.com/MetaMask/core/pull/2063))

## [7.3.5]

### Changed

- Bump dependency on `@metamask/utils` to ^8.1.0 ([#1639](https://github.com/MetaMask/core/pull/1639))
- Bump dependency on `@metamask/base-controller` to ^3.2.3
- Bump dependency on `metamask/controller-utils` to ^5.0.2

### Fixed

- Fix `prepMessageForSigning` in all message managers to handle frozen `messageParams` ([#1733](https://github.com/MetaMask/core/pull/1733))

## [7.3.4]

### Changed

- Update TypeScript to v4.8.x ([#1718](https://github.com/MetaMask/core/pull/1718))

## [7.3.3]

### Changed

- Bump dependency on `@metamask/controller-utils` to ^5.0.0

## [7.3.2]

### Changed

- Bump @metamask/eth-sig-util from 6.0.0 to 7.0.0 ([#1669](https://github.com/MetaMask/core/pull/1669))

## [7.3.1]

### Changed

- Bump dependency on `@metamask/base-controller` to ^3.2.1
- Bump dependency on `@metamask/controller-utils` to ^4.3.2

## [7.3.0]

### Changed

- Add Blockaid validation response to messages ([#1541](https://github.com/MetaMask/core/pull/1541))

## [7.2.0]

### Changed

- Update `@metamask/utils` to `^6.2.0` ([#1514](https://github.com/MetaMask/core/pull/1514))

## [7.1.0]

### Changed

- Replace eth-sig-util with @metamask/eth-sig-util ([#1483](https://github.com/MetaMask/core/pull/1483))

## [7.0.2]

### Fixed

- Avoid race condition when creating typed messages ([#1467](https://github.com/MetaMask/core/pull/1467))

## [7.0.1]

### Fixed

- eth_signTypedData_v4 and v3 should take an object as well as string for data parameter. ([#1438](https://github.com/MetaMask/core/pull/1438))

## [7.0.0]

### Added

- Added `waitForFinishStatus` to `AbstractMessageManager` which is waiting for the message to be proccesed and resolve. ([#1377](https://github.com/MetaMask/core/pull/1377))

### Changed

- **BREAKING:** Removed `addUnapprovedMessageAsync` methods from `PersonalMessageManager`, `TypedMessageManager` and `MessageManager` because it's not consumed by `SignatureController` anymore. ([#1377](https://github.com/MetaMask/core/pull/1377))

## [6.0.0]

### Added

- Add `getAllMessages` and `setMetadata` methods to message managers ([#1364](https://github.com/MetaMask/core/pull/1364))
  - A new optional `metadata` property has been added to the message type as well
- Add support for deferred signing ([#1364](https://github.com/MetaMask/core/pull/1364))
  - `deferSetAsSigned` has been added as a message parameter. This is used to tell the signature controller to not mark this message as signed when the keyring is asked to sign it.
- Add the `setMessageStatusInProgress` method to set a message status to `inProgress` ([#1339](https://github.com/MetaMask/core/pull/1339))

### Changed

- **BREAKING:** The `getCurrentChainId` constructor parameter for each message manager now expects a `Hex` return type rather than a decimal string ([#1367](https://github.com/MetaMask/core/pull/1367))
  - Note that while every message manager class accepts this as a constructor parameter, it's only used by the `TypedMessageManager` at the moment
- Add `@metamask/utils` dependency ([#1370](https://github.com/MetaMask/core/pull/1370))

## [5.0.0]

### Fixed

- **BREAKING:** Add chain validation to `eth_signTypedData_v4` signature requests ([#1331](https://github.com/MetaMask/core/pull/1331))

## [4.0.0]

### Changed

- **BREAKING:** Change type of `securityProviderResponse` to `Record` ([#1214](https://github.com/MetaMask/core/pull/1214))
- **BREAKING:** Update to Node 16 ([#1262](https://github.com/MetaMask/core/pull/1262))

## [3.1.1]

### Fixed

- Ensure message updates get saved in state even when they aren't emitted right away ([#1245](https://github.com/MetaMask/core/pull/1245))
  - The `updateMessage` method included in each message manager accepted an `emitUpdate` boolean argument that would enable to caller to prevent that update from updating the badge (which displays the count of pending confirmations). Unfortunately this option would also prevent the update from being saved in state.
  - This method has been updated to ensure message updates are saved in state, even when the badge update event is suppressed

## [3.1.0]

### Added

- Add DecryptMessageManager ([#1149](https://github.com/MetaMask/core/pull/1149))

## [3.0.0]

### Added

- Add EncryptionPublicKeyManager ([#1144](https://github.com/MetaMask/core/pull/1144))
- Add security provider request to AbstractMessageManager ([#1145](https://github.com/MetaMask/core/pull/1145))

### Changed

- **BREAKING:** The methods `addMessage` and `addUnapprovedMessage` on each "message manager" controller are now asynchronous ([#1145](https://github.com/MetaMask/core/pull/1145))

## [2.1.0]

### Added

- Add SIWE detection support for PersonalMessageManager ([#1139](https://github.com/MetaMask/core/pull/1139))

## [2.0.0]

### Removed

- **BREAKING:** Remove `isomorphic-fetch` ([#1106](https://github.com/MetaMask/controllers/pull/1106))
  - Consumers must now import `isomorphic-fetch` or another polyfill themselves if they are running in an environment without `fetch`

## [1.0.2]

### Changed

- Rename this repository to `core` ([#1031](https://github.com/MetaMask/controllers/pull/1031))
- Update `@metamask/controller-utils` package ([#1041](https://github.com/MetaMask/controllers/pull/1041))

## [1.0.1]

### Changed

- Relax dependencies on `@metamask/base-controller` and `@metamask/controller-utils` (use `^` instead of `~`) ([#998](https://github.com/MetaMask/core/pull/998))

## [1.0.0]

### Added

- Initial release

  - As a result of converting our shared controllers repo into a monorepo ([#831](https://github.com/MetaMask/core/pull/831)), we've created this package from select parts of [`@metamask/controllers` v33.0.0](https://github.com/MetaMask/core/tree/v33.0.0), namely:

    - Everything in `src/message-manager`
    - Message manager-related functions in `src/util.ts` and accompanying tests

    All changes listed after this point were applied to this package following the monorepo conversion.

[Unreleased]: https://github.com/MetaMask/core/compare/@metamask/message-manager@12.0.2...HEAD
[12.0.2]: https://github.com/MetaMask/core/compare/@metamask/message-manager@12.0.1...@metamask/message-manager@12.0.2
[12.0.1]: https://github.com/MetaMask/core/compare/@metamask/message-manager@12.0.0...@metamask/message-manager@12.0.1
[12.0.0]: https://github.com/MetaMask/core/compare/@metamask/message-manager@11.0.3...@metamask/message-manager@12.0.0
[11.0.3]: https://github.com/MetaMask/core/compare/@metamask/message-manager@11.0.2...@metamask/message-manager@11.0.3
[11.0.2]: https://github.com/MetaMask/core/compare/@metamask/message-manager@11.0.1...@metamask/message-manager@11.0.2
[11.0.1]: https://github.com/MetaMask/core/compare/@metamask/message-manager@11.0.0...@metamask/message-manager@11.0.1
[11.0.0]: https://github.com/MetaMask/core/compare/@metamask/message-manager@10.1.1...@metamask/message-manager@11.0.0
[10.1.1]: https://github.com/MetaMask/core/compare/@metamask/message-manager@10.1.0...@metamask/message-manager@10.1.1
[10.1.0]: https://github.com/MetaMask/core/compare/@metamask/message-manager@10.0.3...@metamask/message-manager@10.1.0
[10.0.3]: https://github.com/MetaMask/core/compare/@metamask/message-manager@10.0.2...@metamask/message-manager@10.0.3
[10.0.2]: https://github.com/MetaMask/core/compare/@metamask/message-manager@10.0.1...@metamask/message-manager@10.0.2
[10.0.1]: https://github.com/MetaMask/core/compare/@metamask/message-manager@10.0.0...@metamask/message-manager@10.0.1
[10.0.0]: https://github.com/MetaMask/core/compare/@metamask/message-manager@9.0.0...@metamask/message-manager@10.0.0
[9.0.0]: https://github.com/MetaMask/core/compare/@metamask/message-manager@8.0.2...@metamask/message-manager@9.0.0
[8.0.2]: https://github.com/MetaMask/core/compare/@metamask/message-manager@8.0.1...@metamask/message-manager@8.0.2
[8.0.1]: https://github.com/MetaMask/core/compare/@metamask/message-manager@8.0.0...@metamask/message-manager@8.0.1
[8.0.0]: https://github.com/MetaMask/core/compare/@metamask/message-manager@7.3.9...@metamask/message-manager@8.0.0
[7.3.9]: https://github.com/MetaMask/core/compare/@metamask/message-manager@7.3.8...@metamask/message-manager@7.3.9
[7.3.8]: https://github.com/MetaMask/core/compare/@metamask/message-manager@7.3.7...@metamask/message-manager@7.3.8
[7.3.7]: https://github.com/MetaMask/core/compare/@metamask/message-manager@7.3.6...@metamask/message-manager@7.3.7
[7.3.6]: https://github.com/MetaMask/core/compare/@metamask/message-manager@7.3.5...@metamask/message-manager@7.3.6
[7.3.5]: https://github.com/MetaMask/core/compare/@metamask/message-manager@7.3.4...@metamask/message-manager@7.3.5
[7.3.4]: https://github.com/MetaMask/core/compare/@metamask/message-manager@7.3.3...@metamask/message-manager@7.3.4
[7.3.3]: https://github.com/MetaMask/core/compare/@metamask/message-manager@7.3.2...@metamask/message-manager@7.3.3
[7.3.2]: https://github.com/MetaMask/core/compare/@metamask/message-manager@7.3.1...@metamask/message-manager@7.3.2
[7.3.1]: https://github.com/MetaMask/core/compare/@metamask/message-manager@7.3.0...@metamask/message-manager@7.3.1
[7.3.0]: https://github.com/MetaMask/core/compare/@metamask/message-manager@7.2.0...@metamask/message-manager@7.3.0
[7.2.0]: https://github.com/MetaMask/core/compare/@metamask/message-manager@7.1.0...@metamask/message-manager@7.2.0
[7.1.0]: https://github.com/MetaMask/core/compare/@metamask/message-manager@7.0.2...@metamask/message-manager@7.1.0
[7.0.2]: https://github.com/MetaMask/core/compare/@metamask/message-manager@7.0.1...@metamask/message-manager@7.0.2
[7.0.1]: https://github.com/MetaMask/core/compare/@metamask/message-manager@7.0.0...@metamask/message-manager@7.0.1
[7.0.0]: https://github.com/MetaMask/core/compare/@metamask/message-manager@6.0.0...@metamask/message-manager@7.0.0
[6.0.0]: https://github.com/MetaMask/core/compare/@metamask/message-manager@5.0.0...@metamask/message-manager@6.0.0
[5.0.0]: https://github.com/MetaMask/core/compare/@metamask/message-manager@4.0.0...@metamask/message-manager@5.0.0
[4.0.0]: https://github.com/MetaMask/core/compare/@metamask/message-manager@3.1.1...@metamask/message-manager@4.0.0
[3.1.1]: https://github.com/MetaMask/core/compare/@metamask/message-manager@3.1.0...@metamask/message-manager@3.1.1
[3.1.0]: https://github.com/MetaMask/core/compare/@metamask/message-manager@3.0.0...@metamask/message-manager@3.1.0
[3.0.0]: https://github.com/MetaMask/core/compare/@metamask/message-manager@2.1.0...@metamask/message-manager@3.0.0
[2.1.0]: https://github.com/MetaMask/core/compare/@metamask/message-manager@2.0.0...@metamask/message-manager@2.1.0
[2.0.0]: https://github.com/MetaMask/core/compare/@metamask/message-manager@1.0.2...@metamask/message-manager@2.0.0
[1.0.2]: https://github.com/MetaMask/core/compare/@metamask/message-manager@1.0.1...@metamask/message-manager@1.0.2
[1.0.1]: https://github.com/MetaMask/core/compare/@metamask/message-manager@1.0.0...@metamask/message-manager@1.0.1
[1.0.0]: https://github.com/MetaMask/core/releases/tag/@metamask/message-manager@1.0.0
