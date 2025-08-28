# Changelog Instructions

This document provides comprehensive instructions for maintaining the project changelog. Use this as a reference when updating the CHANGELOG.md file.

## 📋 Overview

The project follows the [Keep a Changelog](https://keepachangelog.com/en/1.0.0/) format and adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html). The changelog serves as a communication tool between developers and users, documenting all notable changes in an accessible format.

## 🏗️ Changelog Structure

```markdown
# Changelog

All notable changes to Graph POS Client will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]
### Added
### Changed  
### Fixed
### Deprecated
### Removed
### Security

## [Version] - YYYY-MM-DD
### Category
- Description of change
```

## 📝 Version Format

### Version Numbers (Semantic Versioning)
- **MAJOR.MINOR.PATCH** (e.g., `1.0.0`)
- **Major**: Breaking changes, incompatible API changes
- **Minor**: New functionality, backward-compatible
- **Patch**: Bug fixes, backward-compatible

### Version Headers
```markdown
## [1.2.3] - 2024-12-28
## [Unreleased]
```

### Date Format
- Use ISO format: `YYYY-MM-DD`
- Example: `2024-12-28`

## 🏷️ Change Categories

### Standard Categories

#### ✅ Added
- New features, functionality, or capabilities
- New modules, components, or pages
- New API endpoints or integrations

**Examples:**
```markdown
### Added
- Date range filters to purchase list page for better data filtering
- New `formatTableColumnDate()` function for centralized table date formatting  
- Currency formatter utility with multiple format options
- Export functionality for inventory reports
```

#### 🔄 Changed
- Modifications to existing functionality
- UI/UX improvements
- Performance enhancements
- Refactoring (user-visible changes only)

**Examples:**
```markdown
### Changed
- Updated all table columns to use centralized date formatting
- Improved AppDatatable component with better performance
- Enhanced POS interface with faster product search
- Migrated from dateFormat to dateTimeFormatter utility
```

#### 🐛 Fixed
- Bug fixes and error corrections
- Performance issues resolved
- Security vulnerabilities patched

**Examples:**
```markdown
### Fixed
- Resolved currency display showing duplicate "BDT" text
- Fixed date filter not working in invoice payments page
- Corrected calculation errors in purchase payments
- Fixed table pagination reset on filter changes
```

#### ⚠️ Deprecated
- Features marked for future removal
- API methods being phased out
- Components scheduled for replacement

**Examples:**
```markdown
### Deprecated
- Legacy dateFormat function (use dateTimeFormatter instead)
- Old currency formatting utility (replaced with currencyNumberWithSymbolFormat)
```

#### ❌ Removed
- Features, functions, or components removed
- Discontinued functionality
- Breaking changes from removal

**Examples:**
```markdown
### Removed
- Redundant "BDT" text from currency displays (handled by formatter)
- Legacy date formatting functions
- Unused component imports
```

#### 🔒 Security
- Security-related changes
- Vulnerability fixes
- Authentication improvements

**Examples:**
```markdown
### Security
- Updated authentication token validation
- Fixed SQL injection vulnerability in search filters
- Enhanced input sanitization across all forms
```

## 🎨 Advanced Categories (Project-Specific)

### 🏪 POS System
For point-of-sale related changes:
```markdown
### POS System
- Enhanced barcode scanning with bulk product addition
- Improved client search with fuzzy matching
- Added hold transaction functionality with reference numbers
```

### 📊 Reporting
For analytics and reporting features:
```markdown
### Reporting
- New financial summary dashboard with KPI cards
- Enhanced inventory reports with stock movement tracking
- Added export functionality for all report types
```

### 👥 User Experience
For UI/UX improvements:
```markdown
### User Experience
- Redesigned navigation with improved accessibility
- Added dark mode support across all modules
- Enhanced mobile responsiveness for tablet devices
```

### 🏢 Multi-Tenant
For tenant-specific features:
```markdown
### Multi-Tenant
- Added organization switching without re-authentication
- Enhanced role-based permissions system
- Improved tenant data isolation and security
```

## ✍️ Writing Guidelines

### Entry Format
```markdown
- **Brief Description** - Detailed explanation with impact on users
- **Component Change** - Technical details for developers
- **Bug Fix** - Problem solved and impact on user experience
```

### Best Practices

#### ✅ DO:
- Write clear, user-focused descriptions
- Use active voice ("Added date filters" not "Date filters were added")
- Include impact on user experience
- Group related changes together
- Use consistent formatting and emoji icons
- Reference specific components or pages
- Explain the "why" when beneficial

#### ❌ DON'T:
- List internal refactoring unless it affects users
- Use technical jargon without explanation
- Write vague descriptions ("Fixed issues", "Improved performance")
- Include commit hashes or technical references
- Mix different types of changes in one entry
- Use inconsistent formatting

### Examples of Good vs Bad Entries

#### ✅ Good Examples:
```markdown
### Added
- **Date range filters** to purchase list page - Users can now filter purchases by purchase date and order date ranges for better data analysis
- **Centralized date formatting** - All table columns now use consistent DD/MM/YYYY format that can be changed from a single location

### Fixed
- **Currency display duplication** - Removed redundant "BDT" text from all currency displays since the formatter already includes currency symbols
- **Table column date formatting** - Purchase and invoice dates now display consistently across all table views
```

#### ❌ Bad Examples:
```markdown
### Added
- Date filters
- New function

### Fixed
- Bug fixes
- Various improvements
- Updated stuff
```

## 🚀 Release Process

### 1. Pre-Release Preparation
```markdown
## [Unreleased]
### Added
- Collect all changes since last release
- Group by category
- Write user-focused descriptions
```

### 2. Version Release
```markdown
## [1.2.0] - 2024-12-28

### 🎉 Feature Release
Brief summary of the release focus and major highlights.

### Added
- List all new features

### Changed  
- List all modifications

### Fixed
- List all bug fixes
```

### 3. Major Release Format
For significant releases (like v1.0.0), use the comprehensive format from the initial release:

```markdown
## [1.0.0] - 2024-12-28

### 🎉 Major Release

Brief overview of the milestone and significance.

### 📋 Core Features
#### 🏪 Module Name
- **Feature Name** - Description
- **Feature Name** - Description

### 🚀 Technical Highlights
#### Category
- Details

### 📈 Business Impact
#### Category  
- Impact description
```

## 🔍 Review Checklist

Before publishing changelog updates:

### Content Review
- [ ] All changes since last release are documented
- [ ] Entries are user-focused and clear
- [ ] Proper categorization is used
- [ ] Breaking changes are clearly marked
- [ ] Version number follows semantic versioning
- [ ] Release date is correct

### Format Review  
- [ ] Markdown formatting is consistent
- [ ] Links to Keep a Changelog and Semantic Versioning are present
- [ ] Emoji usage is consistent with project style
- [ ] Code examples use proper formatting
- [ ] Headers and structure follow the template

### Quality Review
- [ ] No technical jargon without explanation
- [ ] Active voice is used throughout
- [ ] Impact on users is explained
- [ ] Related changes are grouped together
- [ ] Spelling and grammar are correct

## 📚 Examples by Module

### Inventory Management
```markdown
### Added
- **Product search filters** in inventory list - Added category, brand, and stock status filters
- **Barcode generation** for all products - Automatic barcode creation with printable labels

### Changed
- **Purchase workflow** - Streamlined supplier selection with autocomplete search
- **Stock tracking** - Real-time inventory updates during POS transactions

### Fixed
- **Stock calculation errors** in purchase returns
- **Product image upload** failing for large files
```

### Accounting Module
```markdown
### Added
- **Payment tracking** for invoices - Detailed payment history with multiple payment methods
- **Account reconciliation** - Match bank statements with transaction records

### Changed
- **Invoice generation** - Enhanced PDF templates with company branding
- **Expense categorization** - Improved category selection with nested options

### Fixed
- **Currency rounding errors** in tax calculations
- **Account balance** not updating after payment entries
```

### POS System
```markdown
### Added
- **Hold transactions** - Save incomplete sales for later completion
- **Client assignment** - Assign customers to transactions for history tracking

### Changed
- **Product search** - Faster search with barcode scanning support
- **Payment processing** - Support for multiple payment methods in single transaction

### Fixed
- **Cash drawer** integration issues
- **Receipt printing** formatting problems
```

## 🎯 Integration with Development Workflow

### When to Update Changelog
1. **Feature completion** - Add entries when features are complete
2. **Bug fixes** - Document fixes as they are resolved
3. **Breaking changes** - Immediately document any breaking changes
4. **Release preparation** - Review and organize all entries
5. **Post-release** - Archive current version and create new [Unreleased] section

### Version Management in package.json

When releasing a new version, you must update the version number in `package.json` to match the changelog entry:

#### Manual Update
```bash
# Edit package.json directly
{
  "name": "graph-pos-client",
  "version": "1.2.3",  // Update this version number
  "private": true,
  // ... other fields
}
```

#### Using npm version command (Recommended)
```bash
# For patch releases (bug fixes): 1.0.0 -> 1.0.1
npm version patch

# For minor releases (new features): 1.0.0 -> 1.1.0
npm version minor

# For major releases (breaking changes): 1.0.0 -> 2.0.0
npm version major

# For specific version
npm version 1.2.3
```

**Note**: The `npm version` command automatically creates a git commit with the version bump and tags it, so make sure your working directory is clean before running it.

#### Version Synchronization Checklist
When releasing a version:
- [ ] Update CHANGELOG.md with new version section
- [ ] Update package.json version to match changelog
- [ ] Ensure both files have the same version number
- [ ] Commit both files together
- [ ] Create a git tag for the release (if not using `npm version`)

#### Example Release Workflow
```bash
# 1. Update changelog first
# Add entries to CHANGELOG.md under [Unreleased]

# 2. Move [Unreleased] to versioned release
## [1.2.0] - 2024-12-28
### Added
- New features...

# 3. Update package.json version
npm version 1.2.0

# 4. Commit and push
git push origin main --follow-tags
```

### Collaboration Notes
- Maintain changelog alongside code changes
- Use clear, non-technical language for user-facing features
- Consider impact on different user types (admins, cashiers, managers)
- Reference specific components when beneficial for developers
- Keep technical details in CLAUDE.md, user-facing info in CHANGELOG.md
- **Always keep package.json version synchronized with changelog version**

---

**Remember**: The changelog is a communication tool. Write for your users, not just for developers. Every entry should answer "How does this change affect someone using the system?"