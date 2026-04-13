<?php

namespace Tests\Feature;

use App\Models\BlogCategory;
use App\Models\BlogPost;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

class BlogApiTest extends TestCase
{
    use RefreshDatabase;

    private function createUser(): User
    {
        static $counter = 0;
        $counter++;
        return User::create([
            'name' => "Test Author {$counter}",
            'email' => "author{$counter}@example.com",
            'password' => Hash::make('password'),
        ]);
    }

    private function createCategory(string $name = 'Neuigkeiten'): BlogCategory
    {
        return BlogCategory::create([
            'name' => ['de' => $name, 'en' => $name],
            'sort_order' => 1,
        ]);
    }

    private function createPublishedPost(BlogCategory $category, User $author, array $overrides = []): BlogPost
    {
        static $postCounter = 0;
        $postCounter++;
        return BlogPost::create(array_merge([
            'title' => ['de' => "Test Beitrag {$postCounter}", 'en' => "Test Post {$postCounter}"],
            'content' => ['de' => 'Inhalt des Testbeitrags', 'en' => 'Test post content'],
            'excerpt' => ['de' => 'Kurze Zusammenfassung', 'en' => 'Short summary'],
            'category_id' => $category->id,
            'author_id' => $author->id,
            'is_published' => true,
            'published_at' => now()->subDay(),
        ], $overrides));
    }

    public function test_can_list_blog_posts(): void
    {
        $category = $this->createCategory();
        $author = $this->createUser();
        $this->createPublishedPost($category, $author);
        $this->createPublishedPost($category, $author);
        // Unpublished post should not appear
        $this->createPublishedPost($category, $author, [
            'is_published' => false,
            'published_at' => null,
        ]);

        $response = $this->getJson('/api/v1/blog/posts');

        $response->assertOk()
            ->assertJsonStructure([
                'data' => [['id', 'title', 'slug', 'excerpt', 'published_at']],
                'meta' => ['current_page', 'last_page', 'total'],
            ])
            ->assertJsonPath('meta.total', 2);
    }

    public function test_blog_posts_only_returns_published(): void
    {
        $category = $this->createCategory();
        $author = $this->createUser();
        $this->createPublishedPost($category, $author, ['is_published' => false, 'published_at' => null]);

        $response = $this->getJson('/api/v1/blog/posts');

        $response->assertOk()->assertJsonPath('meta.total', 0);
    }

    public function test_can_filter_blog_posts_by_category(): void
    {
        $cat1 = $this->createCategory('Auto News');
        $cat2 = $this->createCategory('Tipps');
        $author = $this->createUser();
        $this->createPublishedPost($cat1, $author);
        $this->createPublishedPost($cat2, $author);

        $response = $this->getJson("/api/v1/blog/posts?category={$cat1->slug}");

        $response->assertOk()->assertJsonPath('meta.total', 1);
    }

    public function test_blog_pagination_works(): void
    {
        $category = $this->createCategory();
        $author = $this->createUser();
        for ($i = 0; $i < 5; $i++) {
            $this->createPublishedPost($category, $author);
        }

        $response = $this->getJson('/api/v1/blog/posts?per_page=2');

        $response->assertOk()
            ->assertJsonCount(2, 'data')
            ->assertJsonPath('meta.total', 5)
            ->assertJsonPath('meta.last_page', 3);
    }

    public function test_can_show_blog_post(): void
    {
        $category = $this->createCategory();
        $author = $this->createUser();
        $post = $this->createPublishedPost($category, $author);

        $response = $this->getJson("/api/v1/blog/posts/{$post->slug}");

        $response->assertOk()
            ->assertJsonStructure([
                'data' => ['id', 'slug', 'title', 'content', 'published_at'],
                'related',
            ])
            ->assertJsonPath('data.slug', $post->slug);
    }

    public function test_blog_post_detail_increments_views(): void
    {
        $category = $this->createCategory();
        $author = $this->createUser();
        $post = $this->createPublishedPost($category, $author, ['views_count' => 0]);

        $this->getJson("/api/v1/blog/posts/{$post->slug}");

        $this->assertDatabaseHas('blog_posts', [
            'id' => $post->id,
            'views_count' => 1,
        ]);
    }

    public function test_blog_post_detail_returns_related_posts(): void
    {
        $category = $this->createCategory();
        $author = $this->createUser();
        $main = $this->createPublishedPost($category, $author);
        $this->createPublishedPost($category, $author);
        $this->createPublishedPost($category, $author);

        $response = $this->getJson("/api/v1/blog/posts/{$main->slug}");

        $response->assertOk();
        $related = $response->json('related');
        $this->assertIsArray($related);
        $this->assertLessThanOrEqual(3, count($related));
    }

    public function test_blog_post_detail_returns_404_for_unpublished(): void
    {
        $category = $this->createCategory();
        $author = $this->createUser();
        $post = $this->createPublishedPost($category, $author, [
            'is_published' => false,
            'published_at' => null,
        ]);

        $response = $this->getJson("/api/v1/blog/posts/{$post->slug}");

        $response->assertNotFound();
    }

    public function test_blog_post_detail_returns_404_for_unknown_slug(): void
    {
        $response = $this->getJson('/api/v1/blog/posts/this-post-does-not-exist-xyz');
        $response->assertNotFound();
    }

    public function test_can_list_categories(): void
    {
        $this->createCategory('Auto News');
        $this->createCategory('Tipps & Tricks');

        $response = $this->getJson('/api/v1/blog/categories');

        $response->assertOk()
            ->assertJsonStructure(['data' => [['name', 'slug', 'posts_count']]]);
    }

    public function test_categories_count_only_published_posts(): void
    {
        $cat = $this->createCategory();
        $author = $this->createUser();
        $this->createPublishedPost($cat, $author);
        $this->createPublishedPost($cat, $author, ['is_published' => false, 'published_at' => null]);

        $response = $this->getJson('/api/v1/blog/categories');

        $response->assertOk();
        $data = $response->json('data');
        $this->assertEquals(1, $data[0]['posts_count']); // Only published post counts
    }

    public function test_blog_locale_parameter_accepted(): void
    {
        $category = $this->createCategory();
        $author = $this->createUser();
        $this->createPublishedPost($category, $author);

        $response = $this->getJson('/api/v1/blog/posts?locale=en');

        $response->assertOk();
    }
}
