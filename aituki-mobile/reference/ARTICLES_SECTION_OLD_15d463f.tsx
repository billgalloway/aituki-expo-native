/**
 * REFERENCE: Articles section from git commit 15d463f (Contentful integration)
 * Restore with: git show 15d463f:aituki-mobile/app/\(tabs\)/index.tsx
 *
 * Old Articles section structure and styles (exact layout):
 * - articleCardWrapper (wrapper with shadow)
 * - articleCard (image on top 170px, then content: title + more-vert, duration)
 * - viewAllButton
 */

// DATA (was in index):
// const articles = [
//   { title: 'Life a healthier life', duration: '8 weeks • Day 15 • 35-45 min pw', image: ImageLibrary.getSafeProgramImage('healthyLife') },
//   ...
// ];

// JSX:
// {/* Articles Section */}
// {articles.map((article, index) => (
//   <View key={index} style={styles.articleCardWrapper}>
//     <View style={styles.articleCard}>
//       <View style={styles.articleImageContainer}>
//         <Image source={{ uri: article.image }} style={styles.articleImage} contentFit="cover" />
//       </View>
//       <View style={styles.articleContent}>
//         <View style={styles.articleHeader}>
//           <Text style={styles.articleTitle}>{article.title}</Text>
//           <TouchableOpacity>
//             <IconLibrary iconName="more-vert" size={20} color={Colors.light.text} />
//           </TouchableOpacity>
//         </View>
//         <Text style={styles.articleDuration}>{article.duration}</Text>
//       </View>
//     </View>
//   </View>
// ))}
// <TouchableOpacity style={styles.viewAllButton}>
//   <Text style={styles.viewAllText}>View all articles</Text>
// </TouchableOpacity>

// STYLES (old – BorderRadius.md = 12; Figma spec uses 8px):
// articleCardWrapper: {
//   width: '100%',
//   marginBottom: Spacing.lg,
//   borderRadius: BorderRadius.md,
//   shadowColor: '#000', shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.140625, shadowRadius: 2, elevation: 2,
// },
// articleCard: {
//   width: '100%',
//   borderRadius: BorderRadius.md,
//   borderWidth: 1,
//   borderColor: 'rgba(31, 86, 97, 0.15)',
//   backgroundColor: Colors.light.background,
//   overflow: 'hidden',
// },
// articleImageContainer: { overflow: 'hidden' },
// articleImage: { width: '100%', height: 170 },
// articleContent: { padding: Spacing.md, paddingTop: Spacing.sm },
// articleHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: Spacing.xs },
// articleTitle: { flex: 1, fontFamily, fontSize: Typography.fontSize.xl, fontWeight: medium, color: text, marginRight: Spacing.sm },
// articleDuration: { fontFamily, fontSize: sm, fontWeight: medium, color: textSecondary },
// viewAllButton: { backgroundColor: primary, borderRadius: full, paddingVertical: sm, paddingHorizontal: md, alignItems: 'center', marginTop: md, marginBottom: xl },
// viewAllText: { fontFamily, fontSize: sm, color: text, fontWeight: regular },
